import { Register, Login } from "@/api/account";
import {
  setToken,
  setUsername,
  removeToken,
  removeUsername,
} from "@/utils/cookiesCars";
export default {
  registerAction(context, requestData) {
    return new Promise((resolve, reject) => {
      // 成功：resolve，失败：reject
      Register(requestData)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  loginAction(context, requestData) {
    return new Promise((resolve, reject) => {
      // 成功：resolve，失败：reject
      Login(requestData)
        .then((response) => {
          const data = response.data;
          console.log(data);
          context.commit("SET_TOKEN", data.token);
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
  logoutAction(context, requestData) {
    return new Promise((resolve, reject) => {
      // 成功：resolve，失败：reject
      context.commit("SET_TOKEN", "");
      context.commit("SET_USERNAME", "");
      removeToken();
      removeUsername();
      resolve();
    });
  },
};
