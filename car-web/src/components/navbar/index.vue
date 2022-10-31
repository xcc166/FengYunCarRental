<template>
  <div class="navbar">
    <ul>
      <li><i class="icon icon-w-44 icon-help"></i></li>
      <li><i class="icon icon-w-44 icon-search"></i></li>
      <li>
        <a href="javascript: void(0);" class="select-car-btn">选择车辆</a>
      </li>
      <li>
        <i class="icon icon-w-44 icon-location" @click="selfLocation"></i>
      </li>
      <li><i class="icon icon-w-44 icon-user" @click="userRouteChange"></i></li>
    </ul>
  </div>
</template>

<script>
import { getAccountToken } from "@/utils/cookies";
export default {
  name: "CNav",
  methods: {
    userRouteChange() {
      this.$router.push({ name: getAccountToken() ? "CUser" : "CLogin" });
    },
    selfLocation() {
      this.$store.commit("SELF_LOCATION");
    },
  },
};
</script>

<style lang="less" scoped>
@import "./style.less";
.navbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 86px;
  z-index: 10;
  text-align: center;
  li {
    display: inline-block;
  }
  .icon {
    margin: 0 17px;
    vertical-align: middle;
    cursor: pointer;
    background-color: #34393f;
    border-radius: 100px;
  }
  z-index: 100;
}
.select-car-btn {
  display: block;
  width: 240px;
  height: 84px;
  margin: 0 17px;
  border-radius: 100px;
  line-height: 84px;
  text-align: center;
  color: #fff;
  font-size: 26px;
  font-weight: 300;
  background-color: #34393f;
}
</style>
