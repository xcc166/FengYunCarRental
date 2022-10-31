import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./styles/main.less";
import store from "./store/index";
//引入路由守卫
import "./router/permit";
//高德地图引入
import "./plugin/main";
//引入全局组件back
import "@c/back/index.js";
Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(ElementUI);
new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
