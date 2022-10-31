import {
  SET_TOKEN,
  SET_USERNAME,
  SET_COLLAPSE,
  UPLOAD_TOKEN,
} from "./mutation-type";
export default {
  [SET_TOKEN](state, value) {
    state.token = value;
  },
  [SET_USERNAME](state, value) {
    state.username = value;
  },
  [SET_COLLAPSE](state) {
    //将collapse取反改变登陆状态
    state.collapse = !state.collapse;
    sessionStorage.setItem("collapse", String(state.collapse));
  },
  [UPLOAD_TOKEN](state, value) {
    state.upload_token = value;
  },
};
