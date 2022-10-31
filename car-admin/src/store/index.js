import Vue from "vue";
import Vuex from "vuex";
import actions from "./vuex/actions";
import mutations from "./vuex/mutations";
import state from "./vuex/state";

Vue.use(Vuex);
export default new Vuex.Store({
  actions,
  mutations,
  state,
});
