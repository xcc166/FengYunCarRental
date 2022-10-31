<template>
  <el-container id="layout-container">
    <el-aside id="layout-aside" :width="collapse === true ? '60px' : '210px'"
      ><CAside
    /></el-aside>
    <el-container>
      <el-header id="layout-header" height="75px"><CHeader /></el-header>
      <el-main id="layout-main"><CMain /></el-main>
    </el-container>
  </el-container>
</template>

<script>
import CAside from "./components/aside.vue";
import CHeader from "./components/header.vue";
import CMain from "./components/main.vue";
export default {
  name: "CLayout",
  components: { CAside, CHeader, CMain },
  computed: {
    collapse() {
      return this.$store.state.collapse;
    },
  },
};
</script>

<style lang="less" scoped>
#layout-container {
  height: 100vh;
}
#layout-aside {
  background-color: #344a5f;
  transition: all 0.3s ease 0s;
}
#layout-header {
  position: relative;
  z-index: 10;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.2);
}
#layout-main {
  border: 30px solid #f7f7f7;
  background-color: #fff;
  padding: 30px;
}
</style>
