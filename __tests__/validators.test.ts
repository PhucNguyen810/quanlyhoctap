import {validateAssignment} from '../src/utils/validators';

test('requires a title and rejects past due dates', () => {
  const pastDate = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  expect(validateAssignment('', '2099-12-31')).toBe('Vui lòng nhập tiêu đề bài tập.');
  expect(validateAssignment('Bài tập', pastDate)).toBe(
    'Hạn nộp phải là một ngày trong tương lai.',
  );
});

test('accepts a future date-only due date', () => {
  const future = new Date(Date.now() + 2 * 86_400_000).toISOString().slice(0, 10);
  expect(validateAssignment('Bài tập', future)).toBeNull();
});
