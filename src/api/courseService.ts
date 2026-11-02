import {request} from './client';
import {Course} from '../types';

export const courseService = {
  getAll: () => request<Course[]>('GET', '/courses'),
  getById: (id: number | string) => request<Course>('GET', `/courses/${id}`),
};
