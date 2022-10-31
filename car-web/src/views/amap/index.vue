<template>
  <div class="amap-wrap">
    <el-amap
      ref="map"
      vid="amapContainer"
      :amap-manager="amapManager"
      :center="center"
      :zoom="zoom"
      :events="events"
      class="amap-demo"
    >
      <!--覆盖物 - 圆-->
      <el-amap-circle
        v-for="item in circle"
        :key="item.id"
        :center="item.center"
        :radius="item.radius"
        :fillColor="item.color"
        :strokeColor="item.color"
        :strokeOpacity="item.strokeOpacity"
        :strokeWeight="item.strokeWeight"
      ></el-amap-circle>
      <!--覆盖物 - 停车场-->
      <el-amap-marker
        v-for="(item, index) in parking"
        :key="item.id"
        :content="item.content"
        :offset="item.offset"
        :position="item.position"
        :vid="index"
      ></el-amap-marker>
      <!--覆盖物 - 停车场 - 车辆-->
      <el-amap-marker
        v-for="(item, index) in parking"
        :extData="item"
        :events="item.events"
        :key="item.id + index"
        :content="item.text"
        :offset="item.offsetText"
        :position="item.position"
        :vid="index"
      ></el-amap-marker>
      <!--覆盖物 - 停车场 - 距离信息-->
      <el-amap-marker
        v-for="(item, index) in parkingInfo"
        zIndex="1000"
        :key="item.id"
        :content="item.text"
        :offset="item.offset"
        :position="item.position"
        :vid="index"
      ></el-amap-marker>
    </el-amap>
  </div>
</template>

<script>
import { SelfLocation } from "./location";
import { Walking } from "./walking";
import styleCss from "./style";
import { AMapManager, lazyAMapApiLoaderInstance } from "vue-amap";
let amapManager = new AMapManager();
export default {
  name: "CAmap",
  data() {
    const _this = this;
    return {
      map: null,
      center: [116.037638, 39.802944],
      zoom: 12,
      // self position
      self_lng: "",
      self_lat: "",
      amapManager,
      events: {
        init(o) {
          lazyAMapApiLoaderInstance.load().then(() => {
            _this.initMap();
          });
        },
      },
      // 自身定位
      circle: [],
      // 停车场位置
      parkingData: {},
      // 停车场信息
      parkingInfo: [],
    };
  },
  methods: {
    /* 初始化地图 */
    initMap() {
      this.map = amapManager.getMap();
      //地图回调函数
      this.$emit("callbackComponent", {
        function: "loadMap",
      });
      this.selfLocation();
    },
    /**
     * 自身定位
     */
    selfLocation() {
      SelfLocation({
        map: this.map,
        complete: (val) => {
          this.selfLocationComplete(val);
        },
      });
    },
    /* 存储数据 */
    saveData(params) {
      if (this[params.key]) {
        this[params.key] = params.value;
      }
    },
    /** 自身定位 成功回调 */
    selfLocationComplete(data) {
      console.log(333);
      this.self_lng = data.position.lng;
      this.self_lat = data.position.lat;
      const json = {
        radius: 4,
        color: "#393e43",
        strokeOpacity: "0.2",
        strokeWeight: "30",
      };
      json.center = [this.self_lng, this.self_lat];
      this.circle.push(json);
    },
    /* 处理自身到停车场的距离 */
    handlerWalking(lnglat) {
      // 步行路线规划
      Walking({
        map: this.map,
        position_start: [this.self_lng, this.self_lat],
        position_end: lnglat, //lnglat是父组件传来的
        complete: (val) => this.handlerWalkingComlete(val),
      });
    },
    /* 传给Walking的函数 */
    handlerWalkingComlete(data) {
      this.parkingInfo = [
        {
          position: this.parkingData.lnglat.split(","),
          text: `<div style='${styleCss.parkingInfoWrap}'>
                        <span style="${styleCss.parkingInfoNumber}">${this.parkingData.carsNumber}</span>
                        辆车<span style="${styleCss.parkingInfoLine}"></span>距离您${data.routes[0].distance}米
                    </div>`,
          offset: [-15, -54],
        },
      ];
    },
  },
  mounted() {
    /*    //使用高德地图原生api实现
    lazyAMapApiLoaderInstance.load().then(() => {
      this.map = new AMap.Map("amapDemo", {
        center: new AMap.LngLat(116.037638, 39.802944),
      });
    }); */
  },
  props: {
    parking: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    /*vuex里的 selfLocation: true */
    "$store.state.selfLocation": {
      handler() {
        this.selfLocation();
      },
    },
  },
};
</script>

<style lang="less">
.amap-wrap {
  height: 100vh;
}
</style>
