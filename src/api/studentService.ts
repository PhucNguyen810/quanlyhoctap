import {request} from './client';
import {Student} from '../types';

const endpoint = '/students/1';

export const studentService = {
  getAll: () => request<Student>('GET', endpoint),
  getById: (id: number | string) => request<Student>('GET', `/students/${id}`),
  update: (id: number | string, data: Partial<Student>) =>
    request<Student>('PATCH', `/students/${id}`, data),
};
