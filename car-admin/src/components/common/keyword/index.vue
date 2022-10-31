<template>
  <el-row :gutter="10">
    <el-col :span="8">
      <el-select v-model="searchKey" placeholder="请选择" @change="inputEnter">
        <el-option
          v-for="item in searchOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-col>
    <el-col :span="16">
      <el-input v-model="searchValue" v-on:input="inputEnter"></el-input>
    </el-col>
  </el-row>
</template>

<script>
import config from "@/config";
export default {
  name: "CKeyWord",
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchKey: "",
      searchValue: "",
      searchOptions: [],
      keywordOptions: config.keyword_options,
    };
  },
  methods: {
    /* 初始化选项 */
    initOptions() {
      const optionsItem = [];
      this.options.forEach((item) => {
        const data = this.keywordOptions.filter((ele) => {
          ele.value === item;
        });
        optionsItem = optionsItem.concat(data);
        this.searchOptions = optionsItem;
      });
    },
    /* 输入时返回数据 */
    inputEnter() {
      let keyword = {};
      //key就是input前面的选项框
      keyword.key = this.searchKey;
      keyword.value = this.searchValue;
      //将数据返回出去改变
      this.$emit("update:value", keyword);
    },
    // 清除
    clear() {
      this.searchKey = "";
      this.searchValue = "";
    },
  },
  watch: {
    keywordOptions: {
      handle(nV) {
        //调用初始化
        this.initOptions();
      },
      //进来之后理解调用
      immediate: true,
    },
  },
};
</script>

<style></style>
