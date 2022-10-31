import axios from "axios";
// cookies
import { getToken, getUsername } from "./cookies";
//引入message
import { Message } from "element-ui";
const BASEURL = process.env.NOOD_ENV === "production" ? "" : "/devapi";
//创建实例
const service = axios.create({
  baseURL: BASEURL, // 请求地址
  timeout: 5000, // 超时
});

//添加请求拦截器
//获取token和Username
service.interceptors.request.use(
  (config) => {
    //获取Token给config的Token赋值
    config.headers["Token"] = getToken();
    config.headers["Username"] = getUsername(); // 携带token
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//添加响应拦截器

service.interceptors.response.use(
  function (response) {
    const data = response.data;
    // 不为0，即接口异常时
    if (data.resCode !== 0) {
      Message.error(data.message);
      return Promise.reject(data);
    } else {
      return data; // return Promise.resolve(data);
    }
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default service;
