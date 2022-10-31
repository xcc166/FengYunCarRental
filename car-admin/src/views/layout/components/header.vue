<template>
  <div id="header-wrap">
    <el-row>
      <el-col :span="10">
        <span class="menu-btn" @click="switchAside">
          <i class="el-icon-menu"></i>
        </span>
      </el-col>
      <el-col :span="13">
        <!-- 退出 -->
        <span class="logout" @click="logout">
          <i class="el-icon-switch-button"></i>
        </span>
        <div class="face-info">
          <img src="../../../assets/face.png" :alt="username" />
          <span class="name">{{ username }}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "CHeader",
  methods: {
    switchAside() {
      //因为没有异步所以直接commit
      this.$store.commit("SET_COLLAPSE");
    },
    logout() {
      this.$confirm("确认退出管理后台", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((result) => {
          this.$srore.dispatch("logoutAction").then((response) => {
            this.$message({
              message: response.message,
              type: "success",
            });
            this.$router.push({
              name: "Login",
            });
          });
        })
        .catch((err) => {});
    },
  },
  computed: {
    //邮箱或者是用户名
    username() {
      return this.$store.state.username;
    },
  },
};
</script>

<style lang="less" scoped>
.menu-btn {
  width: 30px;
  display: inline-block;
  padding-top: 24px;
  cursor: pointer;
  font-size: 30px;
}
.logout {
  float: right;
  border-left: 1px solid #ededed;
  width: 30px;
  text-align: center;
  line-height: 75px;
  font-size: 30px;
  margin-right: -20px;
  cursor: pointer;
}
.face-info {
  float: right;
  padding: 18px 30px 0 0;
  img {
    display: inline-block;
    vertical-align: middle;
    border-radius: 100px;
    margin-right: 18px;
  }
}
</style>
