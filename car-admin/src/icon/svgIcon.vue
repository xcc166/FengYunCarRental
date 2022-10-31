<template>
  <svg class="svg-icon" :class="className" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
<script>
export default {
  name: "SvgIcon",
  props: {
    // 接收父级传入的变量数据
    icon: {
      type: String,
      default: "",
    },
    className: {
      type: String,
      default: "",
    },
  },
  computed: {
    iconName(props) {
      return `#icon-${props.icon}`;
    },
  },
};
</script>
<style lang="less" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
