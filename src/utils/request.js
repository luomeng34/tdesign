import axios from 'axios';
import proxy from '../config/host';
import { getToken } from '@/utils/auth';
import cache from '@/plugins/cache';
import errorCode from "@/utils/errorCode";
const env = import.meta.env.MODE || 'development';
import { MessagePlugin, DialogPlugin } from "tdesign-vue"
import {tansParams} from '@/utils/td'
import store from "@/store";
const API_HOST = env === 'mock' ? '/' : proxy[env].API; // 如果是mock模式 就不配置host 会走本地Mock拦截

const CODE = {
  LOGIN_TIMEOUT: 1000,
  REQUEST_SUCCESS: 0,
  REQUEST_FOBID: 1001,
};
// 是否显示重新登录
export let isRelogin = { show: false };

const instance = axios.create({
  baseURL: API_HOST,
  timeout: 3000,
  withCredentials: true,
});

// eslint-disable-next-line
// @ts-ignore
// axios的retry ts类型有问题
instance.interceptors.retry = 3;

instance.interceptors.request.use((config) =>
{
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  // 是否需要防止数据重复提交
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  if (getToken() && !isToken) {
    // config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['token'] =  getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  config.headers['Content-Type'] = "application/x-www-form-urlencoded"

  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params);
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const requestSize = Object.keys(JSON.stringify(requestObj)).length; // 请求数据大小
    const limitSize = 5 * 1024 * 1024; // 限制存放数据5M
    if (requestSize >= limitSize) {
      console.warn(`[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。')
      return config;
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const s_url = sessionObj.url;                  // 请求地址
      const s_data = sessionObj.data;                // 请求数据
      const s_time = sessionObj.time;                // 请求时间
      const interval = 1000;                         // 间隔时间(ms)，小于此时间视为重复提交
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const message = '数据正在处理，请勿重复提交';
        console.warn(`[${s_url}]: ` + message)
        return Promise.reject(new Error(message))
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
});

instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      const { data } = response;
      if (data.code === CODE.REQUEST_SUCCESS) {
        return data;
      }
      return response;
    }
  },
  (err) => {
    const { config } = err;

    if (!config || !config.retry) return Promise.reject(err);

    config.retryCount = config.retryCount || 0;

    if (config.retryCount >= config.retry) {
      return Promise.reject(err);
    }

    config.retryCount += 1;

    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve({});
      }, config.retryDelay || 1);
    });

    return backoff.then(() => instance(config));
  },
);
// 响应拦截器
instance.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    // 二进制数据则直接返回
    if (res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer') {
      return res.data
    }
    console.log(code)
    if (code === 50001) {
      if (!isRelogin.show) {
        isRelogin.show = true;
        const confirmDia = DialogPlugin.confirm({
          header: '系统提示',
          body: '登录状态已过期，您可以继续留在该页面，或者重新登录',
          confirmBtn: '重新登录',
          cancelBtn: '取消',
          closeBtn:false,
          closeOnOverlayClick:false,
          onConfirm: ({ e }) => {
            isRelogin.show = false;
            store.dispatch('logout').then(() => {
              location.href = '/index';
            })
            // 请求成功后，销毁弹框
            confirmDia.destroy();
          },
          onClose: ({ e, trigger }) => {
            isRelogin.show = false;
            confirmDia.hide();
          },
        });
      }
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      MessagePlugin.error(msg)
      return Promise.reject(new Error(msg))
    } else if (code === 601 || code === 40001) {
      MessagePlugin.warning(msg)
      return Promise.reject('error')
    } else if (code !== 200) {
      Notification.error({ title: msg })
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    MessagePlugin.error(message,5 * 1000)
    return Promise.reject(error)
  }
)

export default instance;
