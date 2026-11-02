import {useCallback, useEffect, useRef, useState} from 'react';
import {Alert} from 'react-native';
import {assignmentService} from '../api/assignmentService';
import {request} from '../api/client';
import {studentService} from '../api/studentService';
import {useNetworkStatus} from './useNetworkStatus';
import {getAll, OutboxAction, remove} from '../storage/outbox';

async function sendAction(action: OutboxAction): Promise<boolean> {
  if (action.method === 'POST' && action.url === '/assignments') {
    const body = {...action.body};
    delete body.localId;
    if (
      (typeof body.courseId !== 'number' && typeof body.courseId !== 'string') ||
      typeof body.title !== 'string' ||
      typeof body.description !== 'string' ||
      typeof body.dueDate !== 'string' ||
      (body.status !== 'todo' && body.status !== 'done')
    ) {
      throw new Error('Dữ liệu bài tập trong hàng đợi không hợp lệ.');
    }
    await assignmentService.create({
      courseId: body.courseId,
      title: body.title,
      description: body.description,
      dueDate: body.dueDate,
      status: body.status,
    });
    return false;
  }

  if (action.method === 'PATCH' && action.url === '/students/1') {
    const current = await studentService.getById(1);
    const localUpdatedAt = String(action.body.updatedAt ?? action.createdAt);
    if (new Date(current.updatedAt).getTime() > new Date(localUpdatedAt).getTime()) {
      return true;
    }
    await studentService.update(1, {
      fullName: String(action.body.fullName ?? ''),
      email: String(action.body.email ?? ''),
      phone: String(action.body.phone ?? ''),
      updatedAt: localUpdatedAt,
    });
    return false;
  }

  await request('PATCH', action.url, action.body);
  return false;
}

export function useOutboxSync(onSynced?: () => Promise<void>) {
  const {isOnline} = useNetworkStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingActions, setPendingActions] = useState<OutboxAction[]>([]);
  const [syncing, setSyncing] = useState(false);
  const syncLock = useRef(false);

  const updateCount = useCallback(async () => {
    const actions = await getAll();
    setPendingActions(actions);
    setPendingCount(actions.length);
  }, []);

  const syncNow = useCallback(async () => {
    if (!isOnline || syncLock.current) {
      return;
    }

    syncLock.current = true;
    setSyncing(true);
    let synced = 0;
    let conflict = false;
    try {
      const actions = await getAll();
      for (const action of actions) {
        try {
          conflict = (await sendAction(action)) || conflict;
          await remove(action.id);
          synced += 1;
        } catch (error) {
          const message =
            typeof error === 'object' && error !== null && 'message' in error
              ? String(error.message)
              : 'Vui lòng kiểm tra kết nối rồi thử lại.';
          Alert.alert('Chưa thể đồng bộ', message);
          break;
        }
      }
      await updateCount();
      if (synced > 0) {
        await onSynced?.();
        Alert.alert('Đồng bộ hoàn tất', `Đã đồng bộ ${synced} thay đổi.`);
      }
      if (conflict) {
        Alert.alert(
          'Dữ liệu đã thay đổi',
          'Thông tin trên máy chủ mới hơn thao tác offline. Đã giữ dữ liệu trên máy chủ.',
        );
      }
    } finally {
      syncLock.current = false;
      setSyncing(false);
      await updateCount();
    }
  }, [isOnline, onSynced, updateCount]);

  useEffect(() => {
    updateCount().catch(() => {
      Alert.alert('Không thể đọc hàng đợi', 'Vui lòng khởi động lại ứng dụng rồi thử lại.');
    });
  }, [updateCount]);

  useEffect(() => {
    if (isOnline) {
      syncNow().catch(() => {
        Alert.alert('Không thể đồng bộ', 'Vui lòng thử lại khi kết nối ổn định.');
      });
    }
  }, [isOnline, syncNow]);

  return {pendingCount, pendingActions, syncing, syncNow, updateCount, isOnline};
}
