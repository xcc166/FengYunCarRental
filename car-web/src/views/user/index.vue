<template>
  <div class="user-container">
    <div class="user-info">
      <img src="../../assets/images/face.png" alt="" />
      <div class="meta">
        <h4 class="name">{{ usename }}</h4>
        <span>
          文明驾驶分
          <strong>0</strong>
        </span>
      </div>
    </div>
    <ul class="group-links">
      <router-link to="/my" tag="a" class="arrow">
        <i class="icon icon-user-link-1"></i>
        我的帐户
      </router-link>
      <router-link to="/order" tag="a" class="arrow">
        <i class="icon icon-user-link-2"></i>
        租车订单
      </router-link>
      <router-link to="/authentication" tag="a" class="arrow">
        <i class="icon icon-user-link-3"></i>
        实名认证
      </router-link>
      <router-link to="/safe" tag="a" class="arrow">
        <i class="icon icon-user-link-4"></i>
        安全设置
      </router-link>
      <router-link to="aa" tag="a" class="arrow">
        <i class="icon icon-user-link-5"></i>
        帮助中心
      </router-link>
    </ul>
    <button class="logout" @click="logout">登出</button>
  </div>
</template>

<script>
import { removeToken, removeUsername } from "@/utils/cookiesCars";
export default {
  name: "CUser",
  data() {
    return {
      usename: this.$store.state.username,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logoutAction").then((resposne) => {
        this.$router.replace({
          name: "CHome",
        });
      });
    },
  },
};
</script>

<style lang="less" scpoed>
@import "./style.less";
.logout {
  position: relative;
  width: 165px;
  height: 58px;
  line-height: 58px;
  border-radius: 100px;
  margin-left: 85px;
  bottom: -60px;
  font-size: 18px;
  border: none;
  color: #fff;
  background-color: #2d3339;
  text-align: center;
}
</style>
