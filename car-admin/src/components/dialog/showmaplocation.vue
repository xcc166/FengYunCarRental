<template>
  <el-dialog
    :title="data.parkingName"
    :visible.sync="dialogVisible"
    class="cars-dialog-center"
    @close="close"
    @opened="opened"
    :close-on-click-modal="false"
  >
    <div style="height: 500px"><CAmap ref="aMap" :options="option_map" /></div>
  </el-dialog>
</template>

<script>
import CAmap from "@/views/amap/index.vue";
export default {
  name: "CShowMapLocation",
  data() {
    return {
      //弹窗显示
      dialogVisible: false,
      // 地图配置
      option_map: {
        mapLoad: true,
      },
    };
  },
  components: { CAmap },
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
    opened() {
      this.$refs.aMap.mapCreate();
      // 调DOM元素的方法时，要确保DOM元素已被加载完成
      this.$nextTick(() => {
        console.log(444);
        // DOM元素渲染完成后执行
        const splitLnglat = this.data.lnglat.split(",");
        const lnglat = {
          lng: splitLnglat[0],
          lat: splitLnglat[1],
        };
        console.log(splitLnglat);
        this.$refs.aMap.setMarker(lnglat);
      });
    },
    close() {
      /* 在子级要修改该值时，尽管实际效果会发生，但会报错。
        给父级添加sync属性，搭配子级update可防止报错 */
      this.$emit("update:flagVisible", false);
    },
  },
  watch: {
    flagVisible(v, o) {
      this.dialogVisible = v;
    },
  },
};
</script>

<style lang="less" scoped></style>
