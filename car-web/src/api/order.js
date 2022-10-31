import service from "../utils/request";
/**
 * 支付查询订单状态
 */
export function OrderStatus(data = {}) {
  return service.request({
    method: "post",
    url: `/apiWeb/orderStatus/`,
    data,
  });
}

/** 租车订单 */
export function OrderList(data = {}) {
  return service.request({
    method: "post",
    url: `/apiWeb/orderList/`,
    data,
  });
}

/** 查找正在使用的车辆 */
export function GetCarsActivation(data = {}) {
  return service.request({
    method: "post",
    url: `/apiWeb/carsActivation/`,
    data,
  });
}

/** 取车 */
export function CarsGet(data = {}) {
  return service.request({
    method: "post",
    url: `/apiWeb/carsGet/`,
    data,
  });
}

/** 还车 */
export function CarsReturn(data = {}) {
  return service.request({
    method: "post",
    url: `/apiWeb/carsReturn/`,
    data,
  });
}

/** 还车 */
export function CarsReturns(data = {}) {
  return service.request({
    method: "post",
    url: `/apiWeb/carsReturnS/`,
    data,
  });
}

/** 取消 */
export function CarsCancel(data = {}) {
  return service.request({
    method: "post",
    url: `/apiWeb/carsCancel/`,
    data,
  });
}
