import service from "../utils/request";
/**
 * 获取验证码
 */
export function GetCarsList(data = {}) {
  return service.request({
    method: "post",
    url: `/apiWeb/cars/`,
    data,
  });
}

/**
 * 获取租赁类型
 */
export function GetLeaseList(data = {}) {
  return service.request({
    method: "post",
    url: `/apiWeb/lease/`,
    data,
  });
}

/**
 * 获取租赁类型
 */
export function ConfirmCars(data = {}) {
  return service.request({
    method: "post",
    url: `/apiWeb/confirmCars/`,
    data,
  });
}
