import { RequestConfig, request as req } from "@umijs/max";

export interface InitialState {
  login?: string;
  userId?: number;
}

export async function getInitialState(): Promise<InitialState> {
  try {
    const user = await req('/api/User/Info');
    return {
      login: user?.login,
      userId: user?.id // Предполагая, что API возвращает id пользователя
    };
  } catch (error) {
    // Если запрос не удался, пробуем получить данные из localStorage
    const login = localStorage.getItem('login');
    const userId = localStorage.getItem('userId');
    
    return {
      login: login || undefined,
      userId: userId ? parseInt(userId) : undefined
    };
  }
}

export const request: RequestConfig = {
  timeout: 30000,
  errorConfig: {
    errorHandler: () => {},
    errorThrower: () => {},
  },
  requestInterceptors: [
    (url, options) => {
      // Получаем токен из localStorage
      const token = localStorage.getItem('token');
      
      // Формируем заголовки
      const headers = {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      // Возвращаем новый объект конфигурации
      return {
        url,
        options: {
          ...options,
          headers
        }
      };
    }
  ],
  responseInterceptors: []
};