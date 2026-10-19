import React, {createContext, useContext, useMemo, useState} from 'react';
import {assignments as initialAssignments, student as initialStudent} from '../data/mockData';
import {Assignment, Student} from '../types';

type StudentContextValue = {
  student: Student;
  updateStudent: (updates: Partial<Pick<Student, 'name' | 'email' | 'phone'>>) => void;
  assignments: Assignment[];
  toggleAssignment: (assignmentId: string) => void;
};

const StudentContext = createContext<StudentContextValue | undefined>(undefined);

export function StudentProvider({children}: React.PropsWithChildren) {
  const [student, setStudent] = useState(initialStudent);
  const [assignments, setAssignments] = useState(initialAssignments);

  const value = useMemo(
    () => ({
      student,
      updateStudent: (updates: Partial<Pick<Student, 'name' | 'email' | 'phone'>>) =>
        setStudent(current => ({...current, ...updates})),
      assignments,
      toggleAssignment: (assignmentId: string) =>
        setAssignments(current =>
          current.map(assignment =>
            assignment.id === assignmentId
              ? {...assignment, completed: !assignment.completed}
              : assignment,
          ),
        ),
    }),
    [assignments, student],
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
