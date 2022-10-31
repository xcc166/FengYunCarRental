<template>
  <div>
    <!-- 登录 -->
    <CLogin></CLogin>
    <!-- 地图 -->
    <CAmap
      @callbackComponent="callbackComponent"
      ref="map"
      :parking="parking"
    ></CAmap>
    <!-- 汽车信息 -->
    <CCars ref="cars"></CCars>
    <!-- 导航 -->
    <CNav></CNav>
    <!-- 会员 -->
    <!-- 采用路由的形式是子路由 -->
    <div class="children-view" :class="{ open: RouteChange }">
      <router-view></router-view>
    </div>
    <div
      class="cars_activation"
      v-if="cars_active_data && cars_active_data.order_no"
    >
      <router-link
        :to="{
          path: '/orderDetailed',
          query: { order_no: cars_active_data.order_no },
        }"
        class="color-white"
        >正在使用的车辆</router-link
      >
    </div>
    <div
      class="button-groure"
      v-if="cars_active_data && cars_active_data.order_no"
    >
      <div v-if="cars_active_data.order_status == 'RETURN'">
        停车场的ID：
        <el-button
          size="mini"
          v-for="item in parkingIdItem"
          :key="item"
          @click="parking_id = item"
          :type="parking_id == item ? 'primary' : ''"
          >{{ item }}</el-button
        >
      </div>
      <el-button
        type="primary"
        size="small"
        @click="carsGet"
        v-if="cars_active_data.order_status == 'WAIT'"
        >取车</el-button
      >
      <!-- <el-button type="primary" size="small" @click="carsReturn" v-if="cars_active_data.order_status == 'RETURN'">还车</el-button> -->
      <el-button
        type="primary"
        size="small"
        @click="carsReturns"
        v-if="cars_active_data.order_status == 'RETURN'"
        >还车</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="carsCancel"
        v-if="cars_active_data.order_status == 'WAIT'"
        >取消</el-button
      >
    </div>
  </div>
</template>

<script>
import CAmap from "../amap/index.vue";
import CCars from "../cars/index.vue";
import CNav from "@c/navbar";
import CLogin from "./login.vue";
import { Parking } from "@/api/parking";
import {
  GetCarsActivation,
  CarsGet,
  CarsReturn,
  CarsCancel,
  CarsReturns,
} from "@/api/order";
export default {
  name: "CIndex",
  data() {
    return {
      parking: [],
      cars_active_data: JSON.parse(localStorage.getItem("cars_active")),
      parking_id: "",
    };
  },
  components: { CAmap, CCars, CNav, CLogin },
  computed: {
    RouteChange() {
      const router = this.$route;
      return router.name === "CHome" ? false : true;
    },
  },

  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data);
      }
    },
    // 地图初始化完成回调
    loadMap() {
      this.getParking();
    },
    /* 获取停车场 */
    getParking() {
      /* 接口有问题 */
      Parking().then((response) => {
        const data = response.data.data;
        console.log(data);
        data.forEach((item) => {
          item.position = item.lnglat.split(",");
          item.content =
            "<img src='" +
            require("@/assets/images/parking_location_img.png") +
            "' />";
          item.offset = [-35, -60];
          item.offsetText = [-30, -55];
          item.label = { content: "11", offset: [10, 10] };
          item.text = `<div style="width: 60px; font-size: 20px; color: #fff; text-align: center;line-height: 50px; height: 60px;">${item.carsNumber}</div>`;
          item.events = {
            click: (e) => {
              this.$store.commit("SET_CARS_LIST_REQUEST", true);
              this.walking(e); // 路线规划
              this.getCarsList(e); // 车辆列表
            },
          };
        });
        this.parking = data;
        // 获取停车的ID
        const parkingId = data.map((item) => item.id);
        this.$store.commit("SET_PARKING_ID", parkingId);
      });
    },
    /* 路线规划 */
    walking(e) {
      //e.target.getExtData()是高德地图的api
      //用途是获取用户自定义数据
      const data = e.target.getExtDate();
      //saveDate是为了保持数据
      this.$refs.map.saveData({
        key: "parkingData",
        value: data,
      });
      this.$refs.map.handlerWalking(data.lnglat.split(","));
    },
    /* 车辆列表 */
    getCarsList() {
      const data = e.target.getExtDate();
      // 父组件调子组件的方法
      this.$refs.cars && this.$refs.cars.getCarsList(data.id);
    },
    /** 获取正在使用的车辆 */
    /**
     * 简单的接口优化
     * 1、查找缓存里面的 order_no，
     * 2、没有情况就请求接口，
     * 3、如果有就不请求
     */
    getCarsActivation() {
      GetCarsActivation().then((response) => {
        const data = response.data;
        if (data) {
          this.cars_active_data = data;
          localStorage.setItem("cars_active", JSON.stringify(data));
        }
      });
    },
    /** 取车 */
    carsGet() {
      CarsGet({
        order_no: this.cars_active_data.order_no,
        cars_id: this.cars_active_data.cars_id,
      }).then((response) => {
        const data = response.data;
        if (data && data.order_status) {
          this.$set(this.cars_active_data, "order_status", data.order_status);
          localStorage.setItem(
            "cars_active",
            JSON.stringify(this.cars_active_data)
          );
        }
      });
    },
    /** 取车 */
    carsReturn() {
      CarsReturn({
        order_no: this.cars_active_data.order_no,
        cars_id: this.cars_active_data.cars_id,
      }).then((response) => {
        this.$message({
          message: response.message,
          type: "success",
        });
        this.cars_active_data = null;
        localStorage.removeItem("cars_active");
      });
    },

    /** 取车 */
    carsReturns() {
      CarsReturns({
        order_no: this.cars_active_data.order_no,
        cars_id: this.cars_active_data.cars_id,
        parking_id: this.parking_id,
      }).then((response) => {
        this.$message({
          message: response.message,
          type: "success",
        });
        this.cars_active_data = null;
        localStorage.removeItem("cars_active");
      });
    },

    /** 取消 */
    carsCancel() {
      CarsCancel({
        order_no: this.cars_active_data.order_no,
        cars_id: this.cars_active_data.cars_id,
      }).then((response) => {
        this.$message({
          message: response.message,
          type: "success",
        });
        this.cars_active_data = null;
        localStorage.removeItem("cars_active");
      });
    },
  },
};
</script>

<style lang="less">
.children-view {
  position: fixed;
  width: 410px;
  right: -600px;
  top: 0;
  bottom: 0;
  background-color: #34393f;
  /* 要比汽车数据的那个zd高 */
  z-index: 101;
  transition: all 0.3s;
  &.open {
    right: 0;
  }
}
.cars_activation {
  position: fixed;
  left: 20px;
  top: 20px;
  border-radius: 100px;
  padding: 10px 20px;
  font-size: 12px;
  background-color: green;
  color: #fff;
}
.button-groure {
  position: fixed;
  left: 20px;
  top: 60px;
}
</style>
