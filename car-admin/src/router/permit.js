import router from "./index";
// cookie
import { getToken } from "@/utils/cookies";
router.beforeEach((to, from, next) => {
  if (getToken()) {
    next();
  } else {
    //当没有token时如果to的地址是login就到/login去
    if (to.path === "/login") {
      next();
    } else {
      //否则就跳转到login去，这是为了防止直接在链接处写网址
      next({ path: "/login" });
    }
  }
});
