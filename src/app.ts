/* import { RequestConfig } from "@umijs/max";

export const request: RequestConfig = {
    timeout: 30000,
    errorConfig: {
        errorHandler: () => { },
        errorThrower: () => { },
    },
    requestInterceptors: [
        (config: any) => {
            const token = localStorage.getItem('token');
            const authHeaders =
                token
                    ? { Authorization: 'Bearer' + token }
                    : {};
            config.headers = { ...config.headers, ...authHeaders, };

            return config;
        },
    ],
    responseInterceptors: [],
}; */