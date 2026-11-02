import {request} from './client';
import {Assignment} from '../types';

export type AssignmentInput = Omit<Assignment, 'id' | 'updatedAt'>;

export const assignmentService = {
  getAll: () =>
    request<Assignment[]>('GET', '/assignments?_expand=course&_sort=dueDate'),
  getById: (id: number | string) =>
    request<Assignment>('GET', `/assignments/${id}?_expand=course`),
  update: (id: number | string, data: Partial<Assignment>) =>
    request<Assignment>('PATCH', `/assignments/${id}`, data),
  create: (data: AssignmentInput) =>
    request<Assignment>('POST', '/assignments', {
      ...data,
      updatedAt: new Date().toISOString(),
    }),
};
