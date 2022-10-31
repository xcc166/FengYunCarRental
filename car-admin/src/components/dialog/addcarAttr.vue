<template>
  <el-dialog
    title="车辆自定义属性添加"
    :visible.sync="dialogVisible"
    class="cars-dialog-center"
    @close="close"
    @opened="opened"
    width="30%"
    :close-on-click-modal="false"
  >
    <CFormData
      :formItem="form_item"
      :formHandler="form_handler"
      :formData="form_data"
      ref="CFormData"
    >
    </CFormData>
  </el-dialog>
</template>

<script>
import CFormData from "@c/form/index.vue";
import { BrandLogo, BrandAdd, BrandDetailed, BrandEdit } from "@/api/brand.js";
import config from "@/config/index.js";
import { CarsTypeAdd } from "@/api/carsAttr";
export default {
  name: "CAddcarAttr",
  data() {
    return {
      // 弹窗显示/关闭标记
      dialogVisible: false,
      // 表单数据
      form_data: {
        key: "",
        value: "",
        //这个值是form当前属性的值
        typeValue: "",
      },
      // 表单项
      form_item: [
        { type: "Input", label: "当前属性", prop: "typeValue", disabled: true },
        { type: "Input", label: "字段", prop: "key" },
        { type: "Input", label: "文本", prop: "value" },
      ],
      // 表单按钮
      form_handler: [
        {
          label: "确定",
          key: "submit",
          type: "danger",
          handler: () => this.submit(),
        },
      ],
      // 状态
      radio_disabled: this.$store.state.config.radio_disabled,
      // 选中的LOGO
      logo_current: "",
      // logo
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
    opened() {},

    /* 提交数据 */
    submitForm() {
      this.add();
    },
    add() {
      const requestData = {
        typeId: this.data.id,
        key: this.form_data.key,
        value: this.form_data.value,
      };
      CarsTypeAdd(requestData).then((response) => {
        this.$message({
          message: response.message,
          type: "success",
        });
        this.resetForm();
      });
    },

    /* 清除表单 */
    resetForm() {
      this.$refs.CFormData.resetForm();
    },
  },
  watch: {
    flagVisible(v, o) {
      this.dialogVisible = v;
    },
    data: {
      handler(v) {
        this.form_data.typeValue = v.value;
      },
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
