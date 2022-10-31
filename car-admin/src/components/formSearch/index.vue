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
      <!-- city -->
      <div v-if="item.type === 'City'">
        <CCityaera ref="city" :cityAreaValue.sync="cityValue" />
      </div>
      <!-- keyword -->
      <div v-if="item.type === 'Keyword'">
        <CKeyWord ref="keyword" :options="item.options" :value.sync="keyword" />
      </div>

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
    </el-form-item>
    <!-- 按钮 -->
    <el-form-item>
      <el-button type="danger" @click="search">搜索</el-button>
      <el-button type="danger" @click="reset" v-if="formConfig.resetButton"
        >重置</el-button
      >
      <template v-for="item in formHandler">
        <el-button
          v-if="item.element === 'link'"
          :key="item.key"
          :type="item.type"
        >
          <router-link :to="item.router">
            <span class="color-white">{{ item.label }}</span>
          </router-link>
        </el-button>
        <el-button
          v-if="item.element === 'button'"
          :key="item.key"
          :type="item.type"
          @click="item.handler && item.handler()"
        >
          {{ item.label }}
        </el-button>

        <!-- <el-button v-for="item in formHandler" :key="item.key" :type="item.type" @click="item.handler && item.handler()">
                        {{ item.label }}
                    </el-button> -->
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
import CCityaera from "@c/common/cityarea/index";
import CKeyWord from "@c/common/keyword/index";
export default {
  name: "CFormSearch",
  data() {
    return {
      keyword: {},
      cityValue: "",
      formData: {},
    };
  },
  components: { CCityaera, CKeyWord, CUpLoad },
  props: {
    formConfig: {
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
    /* 重置 */
    reset() {
      this.$refs.form.resetFields();
      // 城市组件
      if (this.$refs.city[0]) {
        this.$refs.city[0].clear();
      }
      // 关键字
      if (this.$refs.keyword[0]) {
        this.$refs.keyword[0].clear();
      }
    },
    /* 搜索 */
    search() {
      const searchDate = {};
      for (const key in this.formData) {
        if (this.formData[key]) {
          searchDate[key] = this.formData[key];
        }
      }
      /**  组件 */
      // 关键字
      if (this.$refs.keyword && this.keyword.key && this.keyword.value) {
        searchDate[this.keyword.key] = this.keyword.value;
      }
      // 城市
      if (this.$refs.city && this.city_value) {
        searchDate.area = this.city_value;
      }
      //父组件的回调
      this.$emit("callbackComponent", {
        function: "search",
        data: searchDate,
      });
    },

    initFormData() {
      this.formItem.forEach((item) => {
        //读取下拉的属性
        if (item.type === "Select") {
          this.selectOption(item);
        }
      });
    },
    // 字段初始化
    initFormFelid(data) {
      const feild = {};
      this.formItem.forEach((item) => {
        if (item.props) {
          feild[item.props] = "";
        }
      });
      this.formData = feild;
    },
    selectOption(data) {
      const options = this.config[data.options];
      if (options) {
        data.options = options;
      }
    },
  },
  watch: {
    /* 当forItem发生变化时，从刚开始就调用 */
    formItem: {
      handler(nV) {
        this.initFormData();
        this.initFormFelid();
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped></style>
