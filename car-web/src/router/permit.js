import router from "./index";
router.beforeEach((to, form, next) => {
  if (to.meta && to.meta.title) {
    const routerName = to.meta.title;
    document.title = routerName;
    store.commit("SET_ROUTER_NAME", routerName);
  }

  next();
});
