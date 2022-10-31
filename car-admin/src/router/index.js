import VueRouter from "vue-router";
import CLayout from "../views/layout/index.vue";
const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/login", hidden: true },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/login/index.vue"),
      /* hidden是用来判断是否要根据路由渲染 */
      hidden: true,
    },
    /* 控制台 */
    {
      /* 注意这个name不能重复 */
      path: "/home",
      name: "Home1",
      component: CLayout,
      meta: {
        title: "控制台",
        icon: "s-help",
        iconClass: "icon_console",
      },
      children: [
        {
          path: "/console",
          name: "CConsole",
          meta: { title: "首页" },
          component: () => import("../views/console/index.vue"),
        },
      ],
    },

    /* 停车场 */
    {
      path: "/home",
      name: "Home2",
      component: CLayout,
      meta: {
        title: "停车场",
        icon: "place",
        iconClass: "icon_console",
      },
      children: [
        {
          path: "/parking",
          name: "CParking",
          meta: { title: "列表管理" },
          component: () => import("../views/parking/list/index.vue"),
        },
        {
          path: "/add",
          name: "CAdd",
          meta: { title: "新增停车场" },
          component: () => import("../views/parking/add/index.vue"),
        },
      ],
    },

    /* 车辆品牌 */
    {
      path: "/home",
      name: "Home3",
      component: CLayout,
      meta: {
        title: "车辆品牌",
        icon: "place",
        iconClass: "icon_console",
      },
      children: [
        {
          path: "/carsbrand",
          name: "CCarsbrand",
          meta: { title: "品牌列表" },
          component: () => import("../views/carsbrand/index.vue"),
        },
      ],
    },

    /* 车辆管理 */
    {
      path: "/home",
      name: "Home4",
      component: CLayout,
      meta: {
        title: "车辆管理",
        icon: "place",
        iconClass: "icon_console",
      },
      children: [
        {
          path: "/carslist",
          name: "CCarsList",
          meta: { title: "车辆列表" },
          component: () => import("../views/cars/list/index.vue"),
        },
        {
          path: "/carsadd",
          name: "CCarsAdd",
          meta: { title: "添加车辆" },
          component: () => import("../views/cars/add/index.vue"),
        },
      ],
    },

    /* 销售管理 */
    {
      path: "/home",
      name: "Home5",
      component: CLayout,
      meta: {
        title: "销售管理",
        icon: "place",
        iconClass: "icon_console",
      },
      children: [
        {
          path: "/leaselist",
          name: "CLeaseList",
          meta: { title: "车辆列表" },
          component: () => import("../views/sale/leaseList/index.vue"),
        },
      ],
    },
    /* 会员管理 */
    {
      path: "/home",
      name: "Home6",
      component: CLayout,
      meta: {
        title: "会员管理",
        icon: "place",
        iconClass: "icon_console",
      },
      children: [
        {
          path: "/memberList",
          name: "MemberList",
          meta: {
            title: "会员列表",
          },
          component: () => import("../views/member/index.vue"),
        },
        {
          path: "/memberInfo",
          name: "MemberInfo",
          hidden: true,
          meta: {
            title: "会员编辑",
          },
          component: () => import("../views/member/memberInfo"),
        },
        {
          path: "/memberDetailed",
          name: "MemberDetailed",
          hidden: true,
          meta: {
            title: "会员详情",
          },
          component: () => import("../views/member/detailed"),
        },
      ],
    },
    /* 订单管理 */
    {
      path: "/home",
      name: "home7",
      component: CLayout,
      meta: {
        title: "会员管理",
        icon: "place",
        iconClass: "icon_console",
      },
      children: [
        {
          path: "/orderList",
          name: "COrderList",
          meta: {
            title: "订单列表",
          },
          component: () => import("../views/order/index.vue"),
        },
      ],
    },
  ],
});
export default router;
