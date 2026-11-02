import React, {createContext, useCallback, useContext, useMemo} from 'react';
import {Alert} from 'react-native';
import {assignmentService, AssignmentInput} from '../api/assignmentService';
import {ApiError} from '../api/client';
import {courseService} from '../api/courseService';
import {gradeService} from '../api/gradeService';
import {sessionService} from '../api/sessionService';
import {studentService} from '../api/studentService';
import {useCachedQuery} from '../hooks/useCachedQuery';
import {useOutboxSync} from '../hooks/useOutboxSync';
import {useNetworkStatus} from '../hooks/useNetworkStatus';
import {enqueue} from '../storage/outbox';
import {STORAGE_KEYS} from '../storage/keys';
import {setCache} from '../storage/cache';
import {Assignment, ClassSession, Course, Grade, Student} from '../types';

type AppDataContextValue = {
  student: Student | null;
  courses: Course[];
  sessions: ClassSession[];
  assignments: Assignment[];
  grades: Grade[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastUpdated: string;
  pendingCount: number;
  syncing: boolean;
  isOnline: boolean;
  refreshAll: () => Promise<void>;
  syncNow: () => Promise<void>;
  isPending: (kind: 'assignment' | 'student', id?: string | number) => boolean;
  updateStudent: (updates: Partial<Student>) => Promise<boolean>;
  toggleAssignment: (id: string | number) => Promise<void>;
  createAssignment: (input: AssignmentInput) => Promise<boolean>;
};

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

function isNetworkError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    ((error as ApiError).type === 'network' || (error as ApiError).type === 'timeout')
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  return typeof error === 'object' && error !== null && 'message' in error
    ? String(error.message)
    : fallback;
}

export function AppDataProvider({children}: React.PropsWithChildren) {
  const studentQuery = useCachedQuery(STORAGE_KEYS.student, studentService.getAll);
  const coursesQuery = useCachedQuery(STORAGE_KEYS.courses, courseService.getAll);
  const sessionsQuery = useCachedQuery(STORAGE_KEYS.sessions, sessionService.getAll);
  const assignmentsQuery = useCachedQuery(
    STORAGE_KEYS.assignments,
    assignmentService.getAll,
  );
  const gradesQuery = useCachedQuery(STORAGE_KEYS.grades, gradeService.getAll);
  const {isOnline} = useNetworkStatus();
  const studentData = studentQuery.data;
  const setStudentData = studentQuery.setData;
  const assignmentsData = assignmentsQuery.data;
  const setAssignmentsData = assignmentsQuery.setData;
  const refreshStudent = studentQuery.refresh;
  const refreshCourses = coursesQuery.refresh;
  const refreshSessions = sessionsQuery.refresh;
  const refreshAssignments = assignmentsQuery.refresh;
  const refreshGrades = gradesQuery.refresh;

  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshStudent(),
      refreshCourses(),
      refreshSessions(),
      refreshAssignments(),
      refreshGrades(),
    ]);
  }, [
    refreshAssignments,
    refreshCourses,
    refreshGrades,
    refreshSessions,
    refreshStudent,
  ]);
  const {pendingCount, pendingActions, syncing, syncNow, updateCount} =
    useOutboxSync(refreshAll);

  const updateStudent = useCallback(
    async (updates: Partial<Student>) => {
      if (!studentData) {
        return false;
      }
      const previous = studentData;
      const local = {...previous, ...updates, updatedAt: new Date().toISOString()};
      setStudentData(local);
      try {
        await setCache(STORAGE_KEYS.student, local);
      } catch (error) {
        setStudentData(previous);
        Alert.alert('Không thể lưu', getErrorMessage(error, 'Không thể lưu dữ liệu trên thiết bị.'));
        return false;
      }
      if (!isOnline) {
        try {
          await enqueue({
            method: 'PATCH',
            url: '/students/1',
            body: {
              fullName: local.fullName,
              email: local.email,
              phone: local.phone,
              updatedAt: local.updatedAt,
            },
          });
          await updateCount();
          return true;
        } catch (error) {
          setStudentData(previous);
          await setCache(STORAGE_KEYS.student, previous);
          Alert.alert('Không thể lưu', getErrorMessage(error, 'Không thể thêm thao tác vào hàng đợi.'));
          return false;
        }
      }
      try {
        const saved = await studentService.update(1, local);
        setStudentData(saved);
        await setCache(STORAGE_KEYS.student, saved);
        return true;
      } catch (error) {
        if (isNetworkError(error)) {
          await enqueue({
            method: 'PATCH',
            url: '/students/1',
            body: {
              fullName: local.fullName,
              email: local.email,
              phone: local.phone,
              updatedAt: local.updatedAt,
            },
          });
          await updateCount();
          return true;
        }
        setStudentData(previous);
        await setCache(STORAGE_KEYS.student, previous);
        Alert.alert('Không thể lưu', getErrorMessage(error, 'Máy chủ không thể lưu thông tin.'));
        return false;
      }
    },
    [isOnline, setStudentData, studentData, updateCount],
  );

  const toggleAssignment = useCallback(
    async (id: string | number) => {
      const previous = assignmentsData ?? [];
      const item = previous.find(assignment => String(assignment.id) === String(id));
      if (!item) {
        return;
      }
      const nextStatus: Assignment['status'] =
        item.status === 'done' ? 'todo' : 'done';
      const optimistic = previous.map(assignment =>
        String(assignment.id) === String(id)
          ? {...assignment, status: nextStatus, updatedAt: new Date().toISOString()}
          : assignment,
      );
      setAssignmentsData(optimistic);
      try {
        await setCache(STORAGE_KEYS.assignments, optimistic);
      } catch (error) {
        setAssignmentsData(previous);
        Alert.alert('Không thể cập nhật', getErrorMessage(error, 'Không thể lưu dữ liệu trên thiết bị.'));
        return;
      }
      const url = `/assignments/${id}`;
      const body: Partial<Assignment> = {
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      };
      if (!isOnline) {
        try {
          await enqueue({method: 'PATCH', url, body});
          await updateCount();
        } catch (error) {
          setAssignmentsData(previous);
          await setCache(STORAGE_KEYS.assignments, previous);
          Alert.alert('Không thể cập nhật', getErrorMessage(error, 'Không thể thêm thao tác vào hàng đợi.'));
        }
        return;
      }
      try {
        await assignmentService.update(id, body);
      } catch (error) {
        if (isNetworkError(error)) {
          try {
            await enqueue({method: 'PATCH', url, body});
            await updateCount();
          } catch (queueError) {
            setAssignmentsData(previous);
            await setCache(STORAGE_KEYS.assignments, previous);
            Alert.alert('Không thể cập nhật', getErrorMessage(queueError, 'Không thể thêm thao tác vào hàng đợi.'));
          }
          return;
        }
        setAssignmentsData(previous);
        await setCache(STORAGE_KEYS.assignments, previous);
        Alert.alert('Không thể cập nhật', getErrorMessage(error, 'Máy chủ không thể cập nhật bài tập.'));
      }
    },
    [assignmentsData, isOnline, setAssignmentsData, updateCount],
  );

  const createAssignment = useCallback(
    async (input: AssignmentInput) => {
      const previous = assignmentsData ?? [];
      const localId = `offline-${Date.now()}`;
      const optimistic: Assignment = {
        ...input,
        id: localId,
        updatedAt: new Date().toISOString(),
      };
      setAssignmentsData([...previous, optimistic]);
      try {
        await setCache(STORAGE_KEYS.assignments, [...previous, optimistic]);
        await setCache(`assignment-${localId}`, optimistic);
      } catch (error) {
        setAssignmentsData(previous);
        Alert.alert('Không thể thêm bài tập', getErrorMessage(error, 'Không thể lưu dữ liệu trên thiết bị.'));
        return false;
      }

      const queueCreate = async () => {
        await enqueue({
          method: 'POST',
          url: '/assignments',
          body: {...input, localId},
        });
        await updateCount();
      };
      if (!isOnline) {
        try {
          await queueCreate();
          return true;
        } catch (error) {
          setAssignmentsData(previous);
          await setCache(STORAGE_KEYS.assignments, previous);
          Alert.alert('Không thể thêm bài tập', getErrorMessage(error, 'Không thể thêm thao tác vào hàng đợi.'));
          return false;
        }
      }
      try {
        const created = await assignmentService.create(input);
        const updated = [...previous, created];
        setAssignmentsData(updated);
        await setCache(STORAGE_KEYS.assignments, updated);
        return true;
      } catch (error) {
        if (isNetworkError(error)) {
          try {
            await queueCreate();
            return true;
          } catch (queueError) {
            setAssignmentsData(previous);
            await setCache(STORAGE_KEYS.assignments, previous);
            Alert.alert('Không thể thêm bài tập', getErrorMessage(queueError, 'Không thể thêm thao tác vào hàng đợi.'));
            return false;
          }
        }
        setAssignmentsData(previous);
        await setCache(STORAGE_KEYS.assignments, previous);
        Alert.alert('Không thể thêm bài tập', getErrorMessage(error, 'Máy chủ không thể thêm bài tập.'));
        return false;
      }
    },
    [assignmentsData, isOnline, setAssignmentsData, updateCount],
  );

  const isPending = useCallback(
    (kind: 'assignment' | 'student', id?: string | number) =>
      pendingActions.some(action => {
      if (kind === 'student') {
        return action.url === '/students/1';
      }
      return (
        action.url === `/assignments/${id}` ||
        (action.url === '/assignments' &&
          String(action.body.localId) === String(id))
      );
      }),
    [pendingActions],
  );

  const value = useMemo<AppDataContextValue>(
    () => ({
      student: studentQuery.data,
      courses: coursesQuery.data ?? [],
      sessions: sessionsQuery.data ?? [],
      assignments: assignmentsQuery.data ?? [],
      grades: gradesQuery.data ?? [],
      loading:
        studentQuery.loading ||
        coursesQuery.loading ||
        sessionsQuery.loading ||
        assignmentsQuery.loading ||
        gradesQuery.loading,
      refreshing:
        studentQuery.refreshing ||
        coursesQuery.refreshing ||
        sessionsQuery.refreshing ||
        assignmentsQuery.refreshing ||
        gradesQuery.refreshing,
      error:
        studentQuery.error ??
        coursesQuery.error ??
        sessionsQuery.error ??
        assignmentsQuery.error ??
        gradesQuery.error,
      lastUpdated: [
        studentQuery.lastUpdated,
        coursesQuery.lastUpdated,
        sessionsQuery.lastUpdated,
        assignmentsQuery.lastUpdated,
        gradesQuery.lastUpdated,
      ].filter(Boolean).sort().slice(-1)[0] ?? '',
      pendingCount,
      syncing,
      isOnline,
      refreshAll,
      syncNow,
      isPending,
      updateStudent,
      toggleAssignment,
      createAssignment,
    }),
    [
      assignmentsQuery.data,
      assignmentsQuery.error,
      assignmentsQuery.lastUpdated,
      assignmentsQuery.loading,
      assignmentsQuery.refreshing,
      coursesQuery.data,
      coursesQuery.error,
      coursesQuery.lastUpdated,
      coursesQuery.loading,
      coursesQuery.refreshing,
      createAssignment,
      gradesQuery.data,
      gradesQuery.error,
      gradesQuery.lastUpdated,
      gradesQuery.loading,
      gradesQuery.refreshing,
      isOnline,
      isPending,
      pendingCount,
      refreshAll,
      sessionsQuery.data,
      sessionsQuery.error,
      sessionsQuery.lastUpdated,
      sessionsQuery.loading,
      sessionsQuery.refreshing,
      studentQuery.data,
      studentQuery.error,
      studentQuery.lastUpdated,
      studentQuery.loading,
      studentQuery.refreshing,
      syncNow,
      syncing,
      toggleAssignment,
      updateStudent,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const value = useContext(AppDataContext);
  if (!value) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return value;
}
