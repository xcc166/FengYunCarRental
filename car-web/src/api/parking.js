import service from "../utils/request";
/**
 * 获取验证码
 */
export function Parking(data = {}) {
  return service.request({
    method: "post",
    url: "/apiWeb/parking/",
    data,
  });
}