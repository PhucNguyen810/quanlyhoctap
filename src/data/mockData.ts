import {Assignment, ClassSession, Course, Student} from '../types';

export const student: Student = {
  id: 'B23DCCC133',
  name: 'Nguyễn Thị Hồng Phúc',
  className: 'D23CCPM01',
  major: 'Công nghệ thông tin (Định hướng ứng dụng)',
  email: 'PhucNTH.B23CC133@st.ptit.edu.vn',
  phone: '0342 444 586',
};

export const courses: Course[] = [
  {
    id: 'course-1',
    code: 'CS201',
    name: 'Cấu trúc dữ liệu và giải thuật',
    credits: 3,
    lecturer: 'ThS. Trần Quốc Bảo',
    room: 'A2.304',
    grade: 8.6,
  },
  {
    id: 'course-2',
    code: 'CS305',
    name: 'Phát triển ứng dụng di động',
    credits: 3,
    lecturer: 'ThS. Lê Thu Hà',
    room: 'B1.205',
    grade: 9.1,
  },
  {
    id: 'course-3',
    code: 'MA102',
    name: 'Toán rời rạc',
    credits: 3,
    lecturer: 'TS. Phạm Hoàng Nam',
    room: 'C3.102',
    grade: 7.8,
  },
  {
    id: 'course-4',
    code: 'EN202',
    name: 'Tiếng Anh chuyên ngành',
    credits: 2,
    lecturer: 'Cô Nguyễn Ngọc Lan',
    room: 'D2.401',
    grade: 8.2,
  },
  {
    id: 'course-5',
    code: 'CS210',
    name: 'Cơ sở dữ liệu',
    credits: 3,
    lecturer: 'ThS. Võ Thành Đạt',
    room: 'A1.302',
    grade: 8.8,
  },
];

export const classSessions: ClassSession[] = [
  {
    id: 'session-1',
    courseId: 'course-2',
    day: 'Thứ Hai',
    date: '19/10/2026',
    startTime: '07:30',
    endTime: '10:00',
    room: 'B1.205',
    lecturer: 'ThS. Lê Thu Hà',
  },
  {
    id: 'session-2',
    courseId: 'course-1',
    day: 'Thứ Ba',
    date: '20/10/2026',
    startTime: '09:15',
    endTime: '11:45',
    room: 'A2.304',
    lecturer: 'ThS. Trần Quốc Bảo',
  },
  {
    id: 'session-3',
    courseId: 'course-5',
    day: 'Thứ Tư',
    date: '21/10/2026',
    startTime: '13:00',
    endTime: '15:30',
    room: 'A1.302',
    lecturer: 'ThS. Võ Thành Đạt',
  },
  {
    id: 'session-4',
    courseId: 'course-3',
    day: 'Thứ Năm',
    date: '22/10/2026',
    startTime: '07:30',
    endTime: '10:00',
    room: 'C3.102',
    lecturer: 'TS. Phạm Hoàng Nam',
  },
  {
    id: 'session-5',
    courseId: 'course-4',
    day: 'Thứ Sáu',
    date: '23/10/2026',
    startTime: '13:00',
    endTime: '14:30',
    room: 'D2.401',
    lecturer: 'Cô Nguyễn Ngọc Lan',
  },
  {
    id: 'session-6',
    courseId: 'course-2',
    day: 'Thứ Bảy',
    date: '24/10/2026',
    startTime: '08:00',
    endTime: '10:30',
    room: 'Lab B.302',
    lecturer: 'ThS. Lê Thu Hà',
  },
];

export const assignments: Assignment[] = [
  {
    id: 'assignment-1',
    courseId: 'course-2',
    title: 'Ứng dụng quản lý công việc cá nhân',
    dueDate: '22/10/2026',
    description:
      'Xây dựng ứng dụng di động quản lý công việc với các chức năng thêm, sửa, xóa và lọc công việc.',
    completed: false,
  },
  {
    id: 'assignment-2',
    courseId: 'course-1',
    title: 'Cài đặt cây tìm kiếm nhị phân',
    dueDate: '24/10/2026',
    description:
      'Cài đặt các thao tác trên cây tìm kiếm nhị phân và phân tích độ phức tạp thuật toán.',
    completed: false,
  },
  {
    id: 'assignment-3',
    courseId: 'course-5',
    title: 'Thiết kế cơ sở dữ liệu thư viện',
    dueDate: '28/10/2026',
    description:
      'Phân tích yêu cầu, xây dựng sơ đồ ERD và chuyển đổi sang lược đồ quan hệ.',
    completed: true,
  },
  {
    id: 'assignment-4',
    courseId: 'course-3',
    title: 'Bài tập quan hệ và đồ thị',
    dueDate: '02/11/2026',
    description:
      'Giải các bài tập về quan hệ tương đương, đồ thị và cây khung.',
    completed: false,
  },
];
