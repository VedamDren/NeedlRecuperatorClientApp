import { RequestConfig, request as req } from "@umijs/max";

export async function getInitialState() {
    const user = await req('/api/User/Info')
    return{
        login: user?.login
    };
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

      //Возвращаем новый объект конфигурации
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