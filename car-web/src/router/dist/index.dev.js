"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _index = _interopRequireDefault(require("../views/index/index.vue"));

var _index2 = _interopRequireDefault(require("../views/user/index.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = new _vueRouter["default"]({
  routes: [{
    path: "/",
    component: _index["default"],
    name: "CHome",
    children: [{
      path: "/User",
      component: _index2["default"],
      name: "CUser"
    }]
  }]
});
var _default = router;
exports["default"] = _default;