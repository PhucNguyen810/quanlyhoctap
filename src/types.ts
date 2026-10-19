import {NavigatorScreenParams} from '@react-navigation/native';

export type Course = {
  id: string;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  room: string;
  grade: number;
};

export type ClassSession = {
  id: string;
  courseId: string;
  day: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  lecturer: string;
};

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  description: string;
  completed: boolean;
};

export type Student = {
  id: string;
  name: string;
  className: string;
  major: string;
  email: string;
  phone: string;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  CourseDetail: {courseId: string};
  ClassDetail: {sessionId: string};
  AssignmentDetail: {assignmentId: string};
  GradeDetail: {courseId: string};
};

export type TabParamList = {
  Home: undefined;
  Courses: undefined;
  Schedule: undefined;
  Assignments: undefined;
  Profile: undefined;
};
