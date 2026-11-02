import {NavigatorScreenParams} from '@react-navigation/native';

export type RecordId = number | string;

export type Student = {
  id: RecordId;
  studentCode: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phone: string;
  updatedAt: string;
};

export type Course = {
  id: RecordId;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  description: string;
  semester: string;
};

export type ClassSession = {
  id: RecordId;
  courseId: RecordId;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  note: string;
  course?: Course;
};

export type Assignment = {
  id: RecordId;
  courseId: RecordId;
  title: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'done';
  updatedAt: string;
  course?: Course;
};

export type Grade = {
  id: RecordId;
  courseId: RecordId;
  semester: string;
  attendance: number;
  midterm: number;
  final: number;
  total: number;
  letter: string;
  course?: Course;
};

export type RootStackParamList = {
  Home: undefined;
  CourseList: undefined;
  CourseDetail: {id: RecordId};
  Schedule: undefined;
  SessionDetail: {id: RecordId};
  AssignmentList: undefined;
  AssignmentDetail: {id: RecordId};
  AssignmentForm: undefined;
  Profile: undefined;
  EditProfile: undefined;
  GradeList: undefined;
  GradeDetail: {id: RecordId};
};

export type TabParamList = {
  HomeTab: NavigatorScreenParams<Pick<RootStackParamList, 'Home'>>;
  CoursesTab: NavigatorScreenParams<
    Pick<RootStackParamList, 'CourseList' | 'CourseDetail'>
  >;
  ScheduleTab: NavigatorScreenParams<
    Pick<RootStackParamList, 'Schedule' | 'SessionDetail'>
  >;
  AssignmentsTab: NavigatorScreenParams<
    Pick<RootStackParamList, 'AssignmentList' | 'AssignmentDetail' | 'AssignmentForm'>
  >;
  ProfileTab: NavigatorScreenParams<
    Pick<RootStackParamList, 'Profile' | 'EditProfile' | 'GradeList' | 'GradeDetail'>
  >;
};
