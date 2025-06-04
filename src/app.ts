import { RequestConfig } from "@umijs/max";

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

      // Важно: возвращаем новый объект конфигурации
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