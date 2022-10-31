import Vue from "vue";
import VueAMap from "vue-amap";
Vue.use(VueAMap);
window._AMapSecurityConfig = {
  securityJsCode: "125b5c2cc0ce520c9db15e42f6bc3c7f",
};
VueAMap.initAMapApiLoader({
  key: "6185fb9c613595e2d6fe9e0c181afa72",
  plugin: ["AMap.Geocoder"],
  v: "1.4.4",
  uiVersion: "1.0.11", // 版本号
});
