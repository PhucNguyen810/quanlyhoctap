import {Course, Grade} from '../types';

export function toScale4(score10: number): number {
  if (score10 >= 8.5) return 4;
  if (score10 >= 8) return 3.5;
  if (score10 >= 7) return 3;
  if (score10 >= 6.5) return 2.5;
  if (score10 >= 5.5) return 2;
  if (score10 >= 5) return 1.5;
  if (score10 >= 4) return 1;
  return 0;
}

export function calcGpa(grades: Grade[], courses: Course[]) {
  const gradeRows = grades.flatMap(grade => {
    const course = courses.find(item => String(item.id) === String(grade.courseId));
    return course ? [{grade, course}] : [];
  });
  const eligible = gradeRows.filter(({grade}) => grade.total >= 4);
  const credits = eligible.reduce((sum, item) => sum + item.course.credits, 0);
  const weightedScore = eligible.reduce(
    (sum, item) => sum + toScale4(item.grade.total) * item.course.credits,
    0,
  );
  return {gpa: credits ? weightedScore / credits : 0, totalCredits: credits};
}

export function toLetter(score10: number): string {
  if (score10 >= 8.5) return 'A';
  if (score10 >= 8) return 'B+';
  if (score10 >= 7) return 'B';
  if (score10 >= 6.5) return 'C+';
  if (score10 >= 5.5) return 'C';
  if (score10 >= 5) return 'D+';
  if (score10 >= 4) return 'D';
  return 'F';
}
