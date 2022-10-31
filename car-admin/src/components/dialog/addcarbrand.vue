<template>
  <el-dialog
    title="新增车辆品牌"
    :visible.sync="dialogVisible"
    class="cars-dialog-center"
    @close="close"
    @opened="opened"
    :close-on-click-modal="false"
  >
    <CFormData
      :formItem="form_item"
      :formHandler="form_handler"
      :formData="form_data"
      ref="CFormData"
    >
      <template v-slot:logo>
        <div class="upload-img-wrap">
          <div class="upload-img">
            <img v-show="logoCurrent" :src="logoCurrent" />
          </div>
          <ul class="img-list">
            <li
              v-for="(item, index) in logo"
              :key="index"
              @click="getLogo(item.img)"
            >
              <img :src="item.img" :alt="item.name" />
            </li>
          </ul>
        </div>
      </template>
    </CFormData>
  </el-dialog>
</template>

<script>
import CFormData from "@c/form/index.vue";
import { BrandLogo, BrandAdd, BrandDetailed, BrandEdit } from "@/api/brand.js";
import config from "@/config/index.js";
export default {
  name: "CAddcarbrand",
  data() {
    return {
      /* 选中的lodo */
      logoCurrent: "",
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change",
          },
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
      /* 弹窗显示的数据 */
      gridData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      dialogTableVisible: false,
      //弹窗显示
      dialogVisible: false,
      /* dialog表单数据 */
      form_data: {
        nameCh: "",
        nameEn: "",
        imgUrl: "",
        status: "",
        content: "",
      },
      /* 表单项 */
      form_item: [
        { type: "Input", label: "品牌中文", prop: "nameCh" },
        { type: "Input", label: "品牌英文", prop: "nameEn" },
        { type: "Slot", slotName: "logo", label: "LOGO" },
        {
          type: "Radio",
          label: "禁启用",
          prop: "status",
          options: config.radio_disabled,
        },
      ],
      // 表单按钮
      form_handler: [
        {
          label: "确定",
          key: "submit",
          type: "danger",
          handler: () => this.submitForm(),
        },
      ],

      formLabelWidth: "120px",
      logo: [],
    };
  },
  components: {
    CFormData,
  },
  props: {
    flagVisible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    close() {
      console.log(111);
      /* 在子级要修改该值时，尽管实际效果会发生，但会报错。
        给父级添加sync属性，搭配子级update可防止报错 */
      this.resetForm();
      //关闭窗口
      this.dialogVisible = false;
      this.$emit("update:flagVisible", false);
    },
    opened() {
      this.getCarsBrand();
      /* 点击编辑按钮调用 */
      this.getDetailed();
    },
    /* 获取车辆品牌详情 */
    getDetailed() {
      this.form_data = this.data;
      this.logoCurrent = this.data.imgUrl;
    },
    /* 获取车辆的品牌 */
    getCarsBrand() {
      //判断当logo这个数组里面已经请求过值不调用接口
      if (this.logo.length != 0) {
        return false;
      }
      BrandLogo()
        .then((response) => {
          const data = response.data;
          if (data) {
            this.logo = data;
          }
          console.log(response);
        })
        .catch((error) => {});
    },
    /* 小logo的点击 */
    getLogo(data) {
      this.logoCurrent = data;
    },
    /* 提交数据 */
    submitForm() {
      console.log(this.form_data);
      this.data.id ? this.edit() : this.addFromData();
    },
    /* 编辑数据 */
    edit() {
      this.form_data.imgUrl = this.logoCurrent;
      console.log(this.form_data);
      const requestData = JSON.parse(JSON.stringify(this.form_data));
      requestData.id = this.id;
      BrandEdit(requestData)
        .then((response) => {
          console.log(111);
          this.$message({
            type: "success",
            message: response.message,
          });
          this.$edit("callback", {
            function: searchBrand,
          });
          //接口调用成功清除数据
          this.close();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /* 新增数据 */
    addFromData() {
      this.form_data.imgUrl = this.logoCurrent;
      console.log(this.form_data);
      BrandAdd(this.form_data)
        .then((response) => {
          this.$message({
            type: "success",
            message: response.message,
          });
          //接口调用成功清除数据
          this.close();
        })
        .catch((err) => {
          this.close();
          console.log(err);
        });
    },
    /* 清除表单 */
    resetForm() {
      for (const key in this.form_data) {
        this.form_data[key] = "";
      }
      //清除选中logo
      this.logoCurrent = "";
    },
  },
  watch: {
    flagVisible(v, o) {
      this.dialogVisible = v;
    },
  },
  computed: {
    /* 状态 */
    radioDisable() {
      return config.radio_disabled;
    },
  },
};
</script>

<style lang="less" scoped></style>
