"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _vueAmap = _interopRequireDefault(require("vue-amap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vueAmap["default"]);

_vueAmap["default"].initAMapApiLoader({
  key: "756ba256e77139e605448e99a78cd4a4",
  plugin: ["AMap.Scale", "AMap.OverView", "AMap.ToolBar", "AMap.MapType", "Geocoder"],
  v: "1.4.4",
  uiVersion: "1.0.11" // 版本号

});