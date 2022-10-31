import {
  SET_TOKEN,
  SET_USERNAME,
  SET_ROUTER_NAME,
  SET_CARS_LIST_STATUS,
  SET_CARS_LIST_REQUEST,
  SELF_LOCATION,
  SET_PARKING_ID,
} from "./mutation-type";

export default {
  [SET_TOKEN](state, value) {
    state.token = value;
  },
  [SET_USERNAME](state, value) {
    state.username = value;
  },
  [SET_ROUTER_NAME](state, value) {
    state.routerName = value;
  },
  [SET_CARS_LIST_STATUS](state, value) {
    state.isClickCarsList = value;
  },
  [SET_CARS_LIST_REQUEST](state, value) {
    state.isRequestCarsList = value;
  },
  [SELF_LOCATION](state) {
    state.selfLocation = !state.selfLocation; // true 与 false 之间的切换
  },
  [SET_PARKING_ID](state, value) {
    state.parking_id = value;
  },
};
