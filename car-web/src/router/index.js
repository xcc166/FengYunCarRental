import VueRouter from "vue-router";
import CHome from "../views/index/index.vue";
import CUser from "../views/user/index.vue";
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const router = new VueRouter({
  routes: [
    {
      path: "/",
      component: CHome,
      name: "CHome",
      children: [
        /*用户 */
        {
          path: "/user",
          component: CUser,
          meta: {
            title: "用户中心",
          },
          name: "CUser",
        },
        /* 用户忘记密码 */
        {
          path: "/forget",
          component: () => import("../views/acount/forget"),
          name: "CForget",
          meta: {
            title: "忘记密码",
          },
        },
        /*用户登录  */
        {
          path: "/login",
          component: () => import("../views/acount/login"),
          name: "CLogin",
          meta: {
            title: "登录",
          },
        },
        /* 用户注册 */
        {
          path: "/register",
          component: () => import("../views/acount/register"),
          name: "Cregister",
          meta: {
            title: "注册",
          },
        },
        /* 实名认证 */
        {
          path: "/authentication",
          name: "Cauthentication",
          meta: {
            title: "实名认证",
          },
          component: () => import("../views/authentication/index"),
        },
        /* 安全设置 */
        {
          path: "/safe",
          component: () => import("../views/safe/index"),
          name: "CSafe",
        },
        /* 安全设置重置密码 */
        {
          path: "/passWord",
          component: () => import("../views/safe/password"),
          name: "CPassWord",
          meta: {
            title: "重置密码",
          },
        },
        /* 安全设置密码 */
        {
          path: "/capital",
          component: () => import("../views/safe/capital"),
          name: "CCaptial",
          meta: {
            title: "设置资金密码",
          },
        },
        /* 绑定银行卡 */
        {
          path: "/bank",
          component: () => import("../components/back"),
          name: "CBank",
          meta: {
            title: "绑定银行卡",
          },
        },
        /* 添加银行卡 */
        {
          path: "/BankAdd",
          component: () => import("../views/safe/bankadd"),
          name: "CBankAdd",
          meta: {
            title: "添加银行卡",
          },
        },
        /* 我的帐户 */
        {
          path: "/my",
          name: "CMy",
          meta: {
            title: "我的帐户",
          },
          component: () => import("../views/my/index"),
        },
        /* 充值 */
        {
          path: "/recharge",
          name: "CRecharge",
          meta: {
            title: "充值",
          },
          component: () => import("../views/recharge/index"),
        },
        /* 订单 */
        {
          path: "/order",
          name: "COrder",
          meta: {
            title: "租车订单",
          },
          component: () => import("../views/order/index"),
        },
        /* 订单详情 */
        {
          path: "/orderdetailed",
          name: "COrderDetailed",
          meta: {
            title: "租车订单",
          },
          component: () => import("../views/order/detailed.vue"),
        },
        /* 支付状态 */
        {
          path: "/payStatus",
          name: "CPayStatus",
          meta: {
            title: "支付状态",
          },
          component: () => import("../views/pay"),
        },
        /* 支付结果 */
        {
          path: "/payResult",
          name: "CPayResult",
          meta: {
            title: "支付结果",
          },
          component: () => import("../views/pay/result.vue"),
        },
      ],
    },
  ],
});

export default router;
