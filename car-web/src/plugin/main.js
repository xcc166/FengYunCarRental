import Vue from "vue";
import VueAMap from "vue-amap";
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: "756ba256e77139e605448e99a78cd4a4",
  plugin: ["AMap.Geolocation", "AMap.Walking"],
  v: "1.4.4",
  uiVersion: "1.0.11", // 版本号
});
