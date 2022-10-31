<template>
  <div id="login">
    <div class="form-wrap">
      <ul class="menu-tab">
        <li
          :class="{ current: item.current }"
          v-for="(item, index) in menu_switch_item"
          :key="index"
          @click="toggleHigh(item)"
        >
          {{ item.label }}
        </li>
      </ul>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="50px"
        class="login-from"
      >
        <el-form-item prop="mailbox">
          <label for="mailbox" class="form-label">邮箱</label>
          <el-input
            type="text"
            v-model="ruleForm.mailbox"
            autocomplete="off"
            id="mailbox"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <label for="password" class="form-label">密码</label>
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            id="password"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passwords" v-show="model === 'register'">
          <label class="form-label" for="passwords">确认密码</label>
          <el-input
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            id="passwords"
          ></el-input>
        </el-form-item>
        <el-form-item prop="verification">
          <label for="verification" class="form-label">验证码</label>
          <el-row :gutter="10">
            <el-col :span="14">
              <el-input
                v-model.number="ruleForm.verification"
                id="verification"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <el-col :span="10">
              <el-button
                type="success"
                @click="getCodeFn"
                :loading="code_loading"
                >{{ code_text }}</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            :disabled="submit_disabled"
            class="el-button-block"
            @click="submitForm('ruleForm')"
            >{{ model === "login" ? "登录" : "注册" }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import {
  validate_email,
  validate_password,
  stripscript,
} from "../../utils/validate";
import { GetSms, Register, Login } from "../../api/login";
export default {
  name: "CLogin",

  data() {
    /* 验证邮箱 */
    var validateMailBox = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else if (!validate_email(value)) {
        callback(new Error("邮箱格式错误"));
      } else {
        /* 具体验证邮箱内容 */
        callback();
      }
    };
    /* 验证密码 */
    var validatePassWord = (rule, value, callback) => {
      //过滤后的密码
      this.ruleForm.password = stripscript(value);
      value = this.ruleForm.password;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (!validate_password(value)) {
        /* 验证格式6-20位，字母a-z */
        callback(new Error("密码格式错误，位6-20位数字+字母"));
      } else {
        callback();
      }
    };
    /* 验证验证码 */
    var checkVerification = (rule, value, callback) => {
      this.ruleForm.verification = stripscript(value);
      value = this.ruleForm.verification;
      const reg = /^[a-z0-9]{6}$/;
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (!reg.test(value)) {
        callback(new Error("验证码格式错误"));
      } else {
        callback();
      }
    };
    /* 验证重新输入密码 */
    var validatePassWords = (rule, value, callback) => {
      if (this.model === "login") {
        callback();
      }
      //过滤后的密码
      this.ruleForm.passwords = stripscript(value);
      value = this.ruleForm.passwords;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != this.ruleForm.passwords) {
        /* 验证格式6-20位，字母a-z */
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };
    //倒计时方法
    const countdown = (number) => {
      let second = number;
      // 禁用按钮
      this.code_disabled = true;
      // 按钮文本
      this.code_text = `倒计进${second}秒`;
      var timer = setInterval(() => {
        second--;
        this.code_text = `倒计进${second}秒`;
        if (second < 0) {
          this.code_text = `重新获取`;
          // 启用按钮
          this.code_disabled = false;
          clearInterval(timer);
        }
      }, 1000);
    };
    // 注册
    const register = () => {
      const requestData = {
        username: this.ruleForm.mailbox,
        password: md5(this.ruleForm.password),
        code: this.ruleForm.verification,
      };
      console.log(requestData);
      Register(requestData)
        .then((response) => {
          console.log(response);
          this.$message({
            message: response.message,
            type: "success",
          });
          // 重置数据
          this.reset();
        })
        .catch((error) => {
          // 重置数据
          this.reset();
        });
    };
    //登录
    const login = () => {
      const requestDate = {
        username: this.ruleForm.mailbox,
        password: md5(this.ruleForm.password),
        code: this.ruleForm.verification,
      };
      console.log(this.$store);
      this.$store
        .dispatch("loginAction", requestDate)
        .then((response) => {
          this.$message({
            message: response.message,
            type: "success",
          });
          //页面跳转
          this.$router.push({ name: "CConsole" });
        })
        .catch((error) => {
          //重置
          reset();
        });
    };
    return {
      login,
      register,
      countdown,
      code_text: "获取验证码",
      code_loading: false, //按钮加载样式
      submit_disabled: true,
      model: "login",
      ruleForm: {
        mailbox: "",
        password: "",
        verification: "",
        passwords: "",
      },
      rules: {
        mailbox: [{ validator: validateMailBox, trigger: "blur" }],
        password: [{ validator: validatePassWord, trigger: "blur" }],
        verification: [{ validator: checkVerification, trigger: "blur" }],
        passwords: [{ validator: validatePassWords, trigger: "blur" }],
      },
      menu_switch_item: [
        { label: "登录", current: true, type: "login" },
        { label: "注册", current: false, type: "register" },
      ],
    };
  },
  methods: {
    toggleHigh(data) {
      this.menu_switch_item.forEach((i) => (i.current = false));
      data.current = true;
      this.model = data.type;
      this.code_text = "获取验证码";
      this.ruleForm = {
        mailbox: "",
        password: "",
        verification: "",
        passwords: "",
      };
    },

    //获取验证码
    getCodeFn() {
      if (this.ruleForm.mailbox == "") {
        this.$message.error("邮箱不能为空");
        return false;
      }
      let requestData = {
        username: this.ruleForm.mailbox,
        module: this.model,
      };
      //激活按钮
      this.submit_disabled = false;
      //清除加载样式
      this.code_loading = true;
      // 执行倒计时方法
      this.countdown(60);
      /* 两个参数 1：邮箱 2：类型（登录或者注册） */
      GetSms(requestData)
        .then((response) => {
          console.log(response);
          this.$message({
            message: response.message,
            type: "success",
          });
        })
        .catch((error) => {
          this.code_text = "重新获取";
          this.code_loading = false;
        });
    },

    //提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(valid);
          console.log(this);
          this.model === "login" ? this.login() : this.register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //重置
    reset() {
      // 重置表单
      this.$refs[formName].resetFields();
      // 修改模块
      this.current_menu = "login";
      // 判断定时器是否存在，存在则清除
      if (timer) {
        clearInterval(timer);
      }
      // 还原获取验码按钮状态
      this.code_disabled = false;
      this.code_text = "获取验证码";
    },
  },
};
</script>

<style lang="less" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.form-wrap {
  width: 300px;
  padding-top: 100px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    padding: 10px 24px;
    margin: 0 10px;
    color: #fff;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    &.current {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
.form-label {
  display: block;
  color: #fff;
  font-size: 14px;
}
</style>
