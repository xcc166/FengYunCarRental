<template>
  <div class="amap-wrap">
    <el-amap vid="amapContainer" class="amap-demo" :events="events"> </el-amap>
  </div>
</template>

<script>
import { lazyAMapApiLoaderInstance } from "vue-amap";
import { getLonLat } from "./common";
import { addressSetMapCenter } from "./loadtion";
import { amapSetMarker, amapClearMarker } from "./marker";
export default {
  name: "CAmap",
  data() {
    return {
      // 经纬度
      lonlat: {},
      map: null,
      zoom: 18,
      events: {},
    };
  },
  mounted() {
    //使用高德地图原生api实现
    lazyAMapApiLoaderInstance.load().then(() => {
      this.mapCreate();
      this.map.on("click", (e) => {
        const lonlat = getLonLat(e);
        // 更新经纬度
        this.lonlat = lonlat;
        // 回调父组件方法
        this.$emit("lonlat", {
          function: "getLonLat",
          data: {
            lonlat,
          },
        }); // 子组件调父组件的方法
        // 设置点覆盖物
        this.setMarker();
      });
    });
  },
  props: ["options"],
  methods: {
    // 创建地图
    mapCreate(params) {
      this.map = new AMap.Map("amapContainer", {
        center: [116.404765, 39.918052],
        zoom: this.zoom, //初始化地图层级
      });
      this.map.on("complete", () => {
        this.mapLoad();
      });
    },
    /**
     * 地图加载完成
     */
    mapLoad() {
      if (this.options.mapLoad) {
        this.$emit("callback", {
          function: "mapLoad",
        });
      }
    },
    // 销毁地图
    mapDestroy() {
      this.map && this.map.destroy();
    },
    setMapCenter(value) {
      console.log(value);
      addressSetMapCenter(value, this.map);
    },

    // 设置点覆盖物
    setMarker(lonlat) {
      amapSetMarker(lonlat || this.lonlat, this.map);
    },
    /** 清除点覆盖物 */
    clearMarker() {
      amapClearMarker(this.map);
    },
  },
};
</script>

<style lang="less">
.amap-wrap {
  height: 100%;
}
</style>
