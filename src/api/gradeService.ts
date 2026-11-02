import {request} from './client';
import {Grade} from '../types';

export const gradeService = {
  getAll: () => request<Grade[]>('GET', '/grades?_expand=course'),
  getById: (id: number | string) => request<Grade>('GET', `/grades/${id}?_expand=course`),
};
