import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from './keys';

export type OutboxAction = {
  id: string;
  method: 'POST' | 'PATCH';
  url: string;
  body: Record<string, unknown>;
  createdAt: string;
};

export async function getAll(): Promise<OutboxAction[]> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.outbox);
  return value ? (JSON.parse(value) as OutboxAction[]) : [];
}

export async function enqueue(
  action: Omit<OutboxAction, 'id' | 'createdAt'>,
): Promise<OutboxAction> {
  const item: OutboxAction = {
    ...action,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };
  const items = await getAll();
  await AsyncStorage.setItem(STORAGE_KEYS.outbox, JSON.stringify([...items, item]));
  return item;
}

export async function remove(id: string): Promise<void> {
  const items = await getAll();
  await AsyncStorage.setItem(
    STORAGE_KEYS.outbox,
    JSON.stringify(items.filter(item => item.id !== id)),
  );
}
