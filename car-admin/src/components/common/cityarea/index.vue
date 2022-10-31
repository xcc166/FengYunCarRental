<template>
  <el-cascader
    v-model="form.area"
    :props="cascader_props"
    :options="cascader_options"
    @change="onChangeValue"
    :palceholder="initvalue"
    :class="{ 'cascader-input': ifinit }"
  ></el-cascader>
</template>

<script>
import { GetCity } from "@/api/common.js";

export default {
  name: "CCityaera",
  data() {
    const _this = this;

    return {
      address: [],
      addressData: {},
      cascader_props: {
        lazy: true,

        lazyLoad(node, resolve) {
          const { level } = node;
          let requestParams = {};
          // 声明自定义配置
          const jsonType = {
            0: { type: "province" },
            1: { type: "city", code: "province" },
            2: { type: "area", code: "city" },
          };
          //判断当jsonType中间有code时给
          //code赋值并且放到requestParams里面
          if (jsonType[level].code) {
            requestParams[`${jsonType[level].code}_code`] = node.value;
          }
          // type
          requestParams.type = jsonType[level].type;
          //调用接口去获取省市
          GetCity(requestParams)
            .then((response) => {
              const data = response.data.data;
              // 类型
              const type = jsonType[level].type.toUpperCase();
              data.forEach((item) => {
                item.value = item[`${type}_CODE`];
                item.label = item[`${type}_NAME`];
                // 最后一层选择
                if (level === 2) {
                  item.leaf = level >= 2;
                }
              });
              //存储省市区的数据
              _this.addressData[jsonType[level].type] = data;
              //返回节点数据
              resolve(data);
            })
            .catch((err) => {});
          //在后面几级调用方法
          if (node.level !== 0) {
            _this.getAddress(node);
          }
        },
      },
      cascader_options: [],
      form: {
        area: "",
      },
      initvalue: "请选择省市区",
      ifinit: false,
    };
  },
  props: {
    cityAreaValue: {
      type: String,
      default: "",
    },
    mapLocation: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    /* 初始化默认值 */
    initDefault(value) {
      if (value) {
        this.ifinit = true;
        this.initvalue = value.split(",").join(" / ");
      }
    },
    onChangeValue(value) {
      //这个value就是框内的数据
      //将这个的数据放回到父组件内，jion是表示数据用逗号连接
      this.$emit("update:cityAreaValue", value.join());
      //获取最后一项的value值,区县
      const lastCode = value[value.length - 1];
      const area = this.addressData.area.filter(
        (item) => item.value === lastCode
      )[0];
      //将选项的最后一个数据赋值给address
      this.address[2] = area.label;
      if (this.mapLocation) {
        this.$emit("handleAddressValue", {
          function: "setMapCenter",
          data: {
            address: this.address.join(""),
          },
        });
      }
    },
    getAddress(node) {
      const index = node.level - 1;
      this.address[index] = node.label;
      /* 需要传过去字符串用join转换一下 */
      if (this.mapLocation) {
        this.$emit("handleAddressValue", {
          function: "setMapCenter",
          data: {
            address: this.address.join(""),
          },
        });
      }
    },
    clear() {
      this.value = "";
    },
  },
};
</script>

<style lang="less" scoped></style>
