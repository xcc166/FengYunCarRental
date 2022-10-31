import service from "../utils/request";
/**
 * 获取充值列表
 */
export function AmountList(data = {}) {
  return service.request({
    method: "post",
    url: `/apiWeb/amount/`,
    data,
  });
}

/**
 * 充值
 */
export function Pay(data = {}) {
  return service.request({
    method: "post",
    url: `/apiWeb/pay/`,
    data,
  });
}
