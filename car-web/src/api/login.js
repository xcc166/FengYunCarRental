import service from "../utils/request";
/**
 * 获取验证码
 */
export function GetCode(data) {
  return service.request({
    method: "post",
    url: "/apiLogin/getSms/ ",
    data,
  });
}

/**
 * 登录
 */
export function Login(data) {
  return service.request({
    method: "post",
    url: "/apiLogin/login/",
    data,
  });
}
