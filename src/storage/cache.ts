import AsyncStorage from '@react-native-async-storage/async-storage';

export type CacheRecord<T> = {data: T; savedAt: string};

export async function getCache<T>(key: string): Promise<CacheRecord<T> | null> {
  const value = await AsyncStorage.getItem(key);
  return value ? (JSON.parse(value) as CacheRecord<T>) : null;
}

export async function setCache<T>(key: string, data: T): Promise<CacheRecord<T>> {
  const record = {data, savedAt: new Date().toISOString()};
  await AsyncStorage.setItem(key, JSON.stringify(record));
  return record;
}
