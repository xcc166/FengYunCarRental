export const config = {
  message_item: {
    check_real_name: {
      msg: "您未实名认证，请先实名认证",
      router: "Cauthentication",
      type: "identity",
    },
    check_cars: {
      msg: "您未上传驾驶证，请先上传驾驶证，审合通过后便可租车",
      router: "Cauthentication",
      type: "drive",
    },
    gilding: {
      msg: "您还没交押金，请先缴纳押金哦",
      router: "Crecharge",
      type: "gilding",
    },
    illegalAmount: {
      msg: "您的预缴违章金额小于200元，请先预缴违章金额",
      router: "cRecharge",
      type: "illegal",
    },
    blank: {
      msg: "请先绑定银行卡",
      router: "Cauthentication",
    },
    subscribe: {
      msg: "您已预约了其他车辆，请勿再次预约",
    },
  },
  // 车辆状态
  cars_status: {
    WAIT: {
      zh: "待取车",
      color: "#e0881a",
    },
    OVERTIME: {
      zh: "超时",
    },
    OVER: {
      zh: "完成",
      color: "#00e800",
    },
    CANCEL: {
      zh: "取消",
    },
    RETURN: {
      zh: "待还车",
    },
  },
};
