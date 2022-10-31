import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import router from "./router/index";
import store from "./store/index";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./styles/main.less";
import "./icon";
//引入路由守卫
import "./router/permit";
//高德地图
import "./plugins/aMap.js";
Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
