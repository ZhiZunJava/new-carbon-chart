import axios from "axios";
import UtilVar from "../config/UtilVar";
import { Message } from 'element-ui';

// 创建axios实例并设置基础配置
const axiosInstance = axios.create({
    baseURL: UtilVar.baseUrl,
    timeout: 3000
});
// 配置请求头的函数
const handleConfigureAuth = config => ({
   ...config,
    headers: {
        "Content-Type": "application/json"
    }
});

// 处理网络错误的函数，根据错误状态码显示相应错误信息
const handleNetworkError = (errStatus, errMessage) => {
    const networkErrMap = {
        400: errMessage || '错误的请求',
        401: errMessage || '未授权，请重新登录',
        403: '拒绝访问',
        404: '请求错误，未找到该资源',
        500: errMessage || '服务器端出错',
        502: '网络错误',
    };

    const errorMessage = errStatus
       ? networkErrMap[errStatus] || `其他连接错误 --${errStatus}`
        : '无法连接到服务器！';

    Message({
        type: 'error',
        message: errorMessage
    });
};

// 配置请求拦截器
axiosInstance.interceptors.request.use(
    handleConfigureAuth,
    error => Promise.reject(error)
);

// 配置响应拦截器
axiosInstance.interceptors.response.use(
    response => response.status === 200? response : Promise.reject(response.data),
    error => {
        handleNetworkError(error.response.status, error.response.data.message);
        return Promise.reject(error.response);
    }
);

// 处理响应的辅助函数
const handleResponse = async promise => {
    try {
        const result = await promise;
        return [null, result.data];
    } catch (err) {
        return [err, undefined];
    }
};

// 发送GET请求的函数
export const Get = async (url, params) => handleResponse(axiosInstance.get(url, { params }));

// 发送POST请求的函数
export const Post = async (url, data, params) => handleResponse(axiosInstance.post(url, data, { params }));