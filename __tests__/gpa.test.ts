import {calcGpa, toScale4, toLetter} from '../src/utils/gpa';
import {Course, Grade} from '../src/types';

const courses: Course[] = [
  {
    id: 1,
    code: 'CS1',
    name: 'Cấu trúc dữ liệu',
    credits: 3,
    lecturer: 'Giảng viên A',
    description: '',
    semester: 'HK1',
  },
  {
    id: 2,
    code: 'CS2',
    name: 'Cơ sở dữ liệu',
    credits: 2,
    lecturer: 'Giảng viên B',
    description: '',
    semester: 'HK1',
  },
  {
    id: 3,
    code: 'CS3',
    name: 'Toán rời rạc',
    credits: 4,
    lecturer: 'Giảng viên C',
    description: '',
    semester: 'HK1',
  },
];

const grades: Grade[] = [
  {
    id: 1,
    courseId: 1,
    semester: 'HK1',
    attendance: 9,
    midterm: 7,
    final: 7,
    total: 7,
    letter: 'B',
  },
  {
    id: 2,
    courseId: 2,
    semester: 'HK1',
    attendance: 10,
    midterm: 9,
    final: 9,
    total: 9,
    letter: 'A',
  },
  {
    id: 3,
    courseId: 3,
    semester: 'HK1',
    attendance: 3,
    midterm: 2,
    final: 1,
    total: 1.5,
    letter: 'F',
  },
];

test('maps grade thresholds to the specified 4-point scale', () => {
  expect(toScale4(8.5)).toBe(4);
  expect(toScale4(8.4)).toBe(3.5);
  expect(toScale4(7.9)).toBe(3);
  expect(toScale4(3.9)).toBe(0);
  expect(toLetter(8.4)).toBe('B+');
});

test('calculates credit-weighted GPA and excludes failed-course credits', () => {
  expect(calcGpa(grades, courses)).toEqual({gpa: 3.4, totalCredits: 5});
});
