export function validateAssignment(title: string, dueDate: string): string | null {
  if (!title.trim()) {
    return 'Vui lòng nhập tiêu đề bài tập.';
  }
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dueDate);
  const due = new Date(dueDate);
  if (dateOnly) {
    due.setHours(23, 59, 59, 999);
  }
  if (Number.isNaN(due.getTime()) || due.getTime() < Date.now()) {
    return 'Hạn nộp phải là một ngày trong tương lai.';
  }
  return null;
}
