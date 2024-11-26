import axios from "axios";
import UtilVar from "../config/UtilVar";
import { Message } from 'element-ui'
const axiosInstance = axios.create({
    baseURL: UtilVar.baseUrl,
    timeout: 3000
});

const handleConfigureAuth = (config) => {
    // 配置请求头
    config.headers = {
        "Content-Type": "application/json",
    };
    return config;
};

export const handleNetworkError = (errStatus, errMessage) => {
    const networkErrMap = {
        400: errMessage || '错误的请求', // token 失效
        401: errMessage || '未授权，请重新登录',
        403: '拒绝访问',
        404: '请求错误，未找到该资源',
        405: '请求方法未允许',
        408: '请求超时',
        500: errMessage || '服务器端出错',
        501: '网络未实现',
        502: '网络错误',
        503: '服务不可用',
        504: '网络超时',
        505: 'http版本不支持该请求',
    };

    if (errStatus) {
        Message({
            type: 'error',
            message: networkErrMap[errStatus] ||  `其他连接错误 --${errStatus}`
        });
    } else {
        Message.error('无法连接到服务器！');
    }
};

// 配置请求拦截器
axiosInstance.interceptors.request.use(
    (config) => handleConfigureAuth(config),
    (error) => Promise.reject(error),
);

// 配置响应拦截器
axiosInstance.interceptors.response.use(
    (response) => {
        if (response.status !== 200) return Promise.reject(response.data);
        return response;
    },
    (error) => {
        handleNetworkError(error.response.status, error.response.data.message);
        return Promise.reject(error.response);
    },
);

/**
 * 处理响应的辅助函数
 */
const handleResponse = async (
    promise,
    clearFn,
) => {
    try {
        const result = await promise;
        const res = clearFn ? clearFn(result.data) : result.data;
        return [null, res];
    } catch (err) {
        return [err, undefined];
    }
};

/**
 * 发送 GET 请求
 */
export const Get = async (
    url,
    params,
    clearFn,
) => {
    return handleResponse(axiosInstance.get(url, { params }), clearFn);
};

/**
 * 发送 POST 请求
 */
export const Post = async (
    url,
    data,
    params,
    clearFn,
) => {
    return handleResponse(axiosInstance.post(url, data, { params }), clearFn);
};