<template>
  <el-form ref="form" label-width="120px" :model="formData" class="demo-form">
    <el-form-item
      v-for="item in formItem"
      :key="item.prop"
      :label="item.label"
      :prop="item.prop"
      :rules="item.rules"
    >
      <!-- Input-->
      <el-input
        v-if="item.type === 'Input'"
        v-model.trim="formData[item.prop]"
        :placeholder="item.placeholder"
        :style="{ width: item.width }"
        :disabled="item.disabled"
      ></el-input>
      <!-- textarea-->
      <el-input
        type="textarea"
        :rows="item.rows || 5"
        v-if="item.type === 'Textarea'"
        v-model.trim="formData[item.prop]"
        :placeholder="item.placeholder"
        :style="{ width: item.width }"
        :disabled="item.disabled"
      ></el-input>
      <!-- InputNumber -->
      <el-input-number
        v-if="item.type === 'InputNumber'"
        v-model="formData[item.prop]"
        controls-position="right"
        :min="item.min || 0"
        :max="item.max || 10000"
      ></el-input-number>
      <!-- Select-->
      <el-select
        filterable
        v-if="item.type === 'Select'"
        :aaaa="item.options"
        v-model.trim="formData[item.prop]"
        :placeholder="item.placeholder"
        :style="{ width: item.width }"
        :disabled="item.disabled"
      >
        <el-option
          v-for="selectItem in item.options"
          :key="selectItem.value || selectItem[item.select_vlaue]"
          :value="selectItem.value || selectItem[item.select_vlaue]"
          :label="selectItem.label || selectItem[item.select_label]"
        ></el-option>
      </el-select>
      <!-- 禁启用 -->
      <el-radio-group
        v-if="item.type === 'Disabled'"
        v-model="formData[item.prop]"
      >
        <el-radio
          v-for="radio in radio_disabled"
          :label="radio.value"
          :key="radio.value"
          >{{ radio.label }}</el-radio
        >
      </el-radio-group>
      <!-- slot -->
      <slot v-if="item.type === 'Slot'" :name="item.slotName" />
      <!-- 类型 -->
      <el-radio-group
        v-if="item.type === 'Radio'"
        v-model="formData[item.prop]"
      >
        <el-radio
          v-for="radio in item.options"
          :label="radio.value"
          :key="radio.value"
          >{{ radio.label }}</el-radio
        >
      </el-radio-group>
      <!-- 文件上传 -->
      <template v-if="item.type === 'Upload'">
        <CUpLoad
          :imgUrl="formData[item.prop]"
          :value.sync="formData[item.prop]"
          :requestFlag="item.requestFlag"
        />
      </template>
    </el-form-item>
    <!-- 按钮 -->
    <el-form-item>
      <el-button
        v-for="item in formHandler"
        :key="item.key"
        :type="item.type"
        @click="item.handler && item.handler()"
      >
        {{ item.label }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import config from "@/config";
import CUpLoad from "@c/upload";

export default {
  name: "CFormData",
  data() {
    return {
      // 禁启用数据
      radio_disabled: config.radio_disabled,
      type_msg: {
        Input: "请输入",
        InputNumber: "请输入",
        Radio: "请选择",
        Select: "请选择",
        Disabled: "请选择",
        Upload: "请上传",
      },
    };
  },
  components: { CUpLoad },
  props: {
    labelWidth: {
      type: String,
      default: "120px",
    },
    formData: {
      type: Object,
      default: () => {},
    },
    formItem: {
      type: Array,
      default: () => [],
    },
    // 按钮
    formHandler: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    /* 清除表单 */
    resetForm() {
      //清除表单
      this.$refs.form.resetFields();
    },

    initFormData() {
      this.formItem.forEach((item) => {
        // rules 规则
        if (item.required) {
          this.rules(item);
        }
        // 自定义检验规则
        if (item.validator) {
          item.rules = item.validator;
        }
      });
    },
    rules(item) {
      const requiredRules = [
        {
          required: true,
          message:
            item.required_msg || `${this.type_msg[item.type]}${item.label}`,
          trigger: "change",
        },
      ];
      if (item.rules && item.rules.length > 0) {
        item.rules = requiredRules.concat(item.rules);
      } else {
        item.rules = requiredRules;
      }
    },
  },
  watch: {
    formItem: {
      handler(nV) {
        this.initFormData();
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped></style>
