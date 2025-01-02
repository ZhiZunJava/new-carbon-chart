import axios from "axios";
import UtilVar from "../config/UtilVar";

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

// 配置请求拦截器
axiosInstance.interceptors.request.use(
    handleConfigureAuth,
    error => Promise.reject(error)
);

// 配置响应拦截器
axiosInstance.interceptors.response.use(
    response => response.status === 200? response : Promise.reject(response.data),
    error => { 
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

// GET请求
export const Get = async (url, params) => handleResponse(axiosInstance.get(url, { params }));

// POST请求
export const Post = async (url, data, params) => handleResponse(axiosInstance.post(url, data, { params }));