export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return `${String(date.getDate()).padStart(2, '0')}/${String(
    date.getMonth() + 1,
  ).padStart(2, '0')}/${date.getFullYear()}`;
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const datePart = formatDate(value);
  const timePart = `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}`;
  return `${timePart}, ${datePart}`;
}

export function isOverdue(value: string): boolean {
  return new Date(value).getTime() < Date.now();
}

export function daysLeft(value: string): number {
  return Math.ceil((new Date(value).getTime() - Date.now()) / 86_400_000);
}

export function dayOfWeekNumber(date = new Date()): number {
  return date.getDay() === 0 ? 8 : date.getDay() + 1;
}
