/*
 * @Author: Anixuil
 * @Date: 2024-09-13 17:25:56
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-08-15 13:42:55
 * @Description: 请填写简介
 */
import axios from 'axios'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { showMessage } from './handleError'
import { ElMessage } from 'element-plus'

// 创建axios实例
const request = axios.create({
    baseURL: 'http://localhost:13300',
    timeout: 60000
})

request.interceptors.request.use(
    (config: AxiosRequestConfig): any => {
        config.headers = {
            'access_token': '',
            'refresh_token': '',
            'Tenant-Id': ''
        }
        return config
    },
    (err: AxiosError) => {
        console.log('err', err);

        // 处理错误请求
        return Promise.reject(err);
    }
)

//http response 拦截器
request.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        const { response } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            ElMessage.error((response.data as any)?.msg || '请求失败')
            showMessage(response.status);           // 传入响应码，匹配响应码对应信息
            return Promise.reject(response.data);
        } else {
            ElMessage.warning('网络连接异常,请稍后再试!');
        }
    }
);

export default request