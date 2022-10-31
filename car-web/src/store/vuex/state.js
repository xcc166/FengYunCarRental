// cookies
import {
  setToken,
  setUsername,
  removeToken,
  removeUsername,
  getToken,
  getUsername,
} from "@/utils/cookiesCars";
export default {
  token: "" || getToken(),
  username: "" || getUsername(), // 获取数据的来源
  // 是否点击了车辆列表
  isClickCarsList: true,
  // 是否是请求车辆列表
  isRequestCarsList: false,
  routerName: "",
  selfLocation: true,
  // 停车场ID，
  parking_id: [],
};
