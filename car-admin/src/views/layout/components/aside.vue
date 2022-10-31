<template>
  <div>
    <h1 class="logo">
      <img
        src="../../../assets/logo.png"
        alt=""
        :class="{ 'mini-logo': isCollapse }"
      />
    </h1>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="#344a5f"
      text-color="#fff"
      active-text-color="#fff"
      router
      unique-opened
    >
      <div v-for="(item, index) in routers" :key="index">
        <!-- 这个hidden是判读是否用router来渲染 -->
        <el-submenu v-if="!item.hidden" :key="item.path" :index="index + ''">
          <template slot="title">
            <i :class="`el-icon-${item.meta.icon}`"></i>
            <span v-show="!isCollapse">
              <span>{{ item.meta ? item.meta.title : "" }}</span>
            </span>
          </template>
          <template v-if="item.children && item.children.length > 0">
            <div v-for="(sub, index) in item.children" :key="index">
              <el-menu-item v-if="!sub.hidden" :key="sub.id" :index="sub.path">
                {{ sub.meta ? sub.meta.title : "" }}
              </el-menu-item>
            </div>
          </template>
        </el-submenu>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "CAside",
  data() {
    return {};
  },

  computed: {
    isCollapse() {
      return this.$store.state.collapse;
    },
    routers() {
      return this.$router.options.routes;
    },
    defalutActive() {
      const route = this.$route;
      return route.path;
    },
  },
};
</script>

<style lang="less" scoped>
.logo {
  img {
    margin: auto;
    height: 113px;
    transition: all 0.3s ease 0s;
  }
  .mini-logo {
    height: 50px;
  }
}
</style>
