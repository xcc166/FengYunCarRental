import { Login, Logout } from "../../api/login.js";
import {
  setToken,
  setUsername,
  getUsername,
  removeToken,
  removeUsername,
} from "@/utils/cookies";
export default {
  loginAction(context, value) {
    return new Promise((resolve, reject) => {
      Login(value)
        .then((response) => {
          let data = response.data;
          console.log(data);
          //传入token
          context.commit("SET_TOKEN", data.token);
          //传入username
          context.commit("SET_USERNAME", data.username);
          setToken(data.token);
          setUsername(data.username);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  logoutAction(context) {
    return new Promise((resolve, reject) => {
      Logout()
        .then((response) => {
          console.log(response);
          //清除token和username
          removeToken();
          removeUsername();
          //将state的token和username设置为空
          context.commit("SET_TOKEN", "");
          context.commit("SET_USERNAME", "");
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
