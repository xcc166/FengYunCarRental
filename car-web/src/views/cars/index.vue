<template>
  <div class="cars-wrap" v-if="carsList && carsList.length > 0">
    <div class="cars-swiper-wrap">
      <Swiper class="swiper" :options="swiperOption">
        <swiper-slide v-for="item in carsList" :key="item.id">
          <CCarsList :data="item"></CCarsList>
        </swiper-slide>
      </Swiper>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import CCarsList from "./carslist/index.vue";
import "swiper/css/swiper.css";
import { GetCarsList } from "@/api/cars";
export default {
  name: "CCars",
  methods: {},
  components: { CCarsList, Swiper, SwiperSlide },
  data() {
    return {
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 50,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      carsList: [],
    };
  },
  methods: {
    getCarsList() {
      GetCarsList({ parkingId }).then((response) => {
        //变量名称相同的情况下，可以用一个，是ES6的语法
        const data = response.data.data;
        data && (this.carsList = data);
        // 还原状态
        this.$store.commit("SET_CARS_LIST_REQUEST", false);
      });
    },
  },
  watch: {
    "$store.state.isClickCarsList": {
      handler(v, o) {},
    },
  },
};
</script>

<style lang="less" scoped>
@import "./style.less";
.cars-wrap {
  position: fixed;
  top: 400px;
  width: 100%;
  z-index: 101;
}
</style>
