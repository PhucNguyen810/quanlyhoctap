import {BASE_URL, TIMEOUT} from '../config';

export type ApiError = {
  type: 'network' | 'timeout' | 'http';
  status: number | null;
  message: string;
};

export async function request<T>(
  method: 'GET' | 'POST' | 'PATCH',
  url: string,
  body?: unknown,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: {'Content-Type': 'application/json'},
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw {
        type: 'http',
        status: response.status,
        message: `Máy chủ trả về lỗi ${response.status}.`,
      } satisfies ApiError;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      (error as ApiError).type === 'http'
    ) {
      throw error;
    }

    if (controller.signal.aborted) {
      throw {
        type: 'timeout',
        status: null,
        message: 'Máy chủ phản hồi quá lâu. Vui lòng thử lại.',
      } satisfies ApiError;
    }

    throw {
      type: 'network',
      status: null,
      message: 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng.',
    } satisfies ApiError;
  } finally {
    clearTimeout(timeout);
  }
}
