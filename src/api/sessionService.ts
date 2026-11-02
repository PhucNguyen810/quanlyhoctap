import {request} from './client';
import {ClassSession} from '../types';

export const sessionService = {
  getAll: () => request<ClassSession[]>('GET', '/sessions?_expand=course'),
  getById: (id: number | string) =>
    request<ClassSession>('GET', `/sessions/${id}?_expand=course`),
};
