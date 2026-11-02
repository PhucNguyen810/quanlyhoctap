import {useCallback, useEffect, useRef, useState} from 'react';
import {useNetworkStatus} from './useNetworkStatus';
import {getCache, setCache} from '../storage/cache';

export function useCachedQuery<T>(key: string, fetcher: () => Promise<T>) {
  const {isOnline} = useNetworkStatus();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const hasData = useRef(false);

  const refresh = useCallback(async () => {
    if (!isOnline) {
      setLoading(false);
      setRefreshing(false);
      if (!hasData.current) {
        setError('Đang offline và chưa có dữ liệu lưu trên thiết bị.');
      }
      return;
    }

    setRefreshing(true);
    setError(null);
    try {
      const result = await fetcher();
      const record = await setCache(key, result);
      hasData.current = true;
      setData(result);
      setLastUpdated(record.savedAt);
    } catch (queryError) {
      const message =
        typeof queryError === 'object' &&
        queryError !== null &&
        'message' in queryError
          ? String(queryError.message)
          : 'Đã xảy ra lỗi khi tải dữ liệu.';
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetcher, isOnline, key]);

  useEffect(() => {
    let active = true;
    getCache<T>(key)
      .then(record => {
        if (active && record) {
          hasData.current = true;
          setData(record.data);
          setLastUpdated(record.savedAt);
          setError(null);
        }
      })
      .catch(() => {
        if (active) {
          setError('Không thể đọc dữ liệu đã lưu trên thiết bị.');
        }
      })
      .finally(() => {
        if (active) {
          refresh();
        }
      });

    return () => {
      active = false;
    };
  }, [key, refresh]);

  return {data, setData, loading, error, refreshing, lastUpdated, refresh};
}
