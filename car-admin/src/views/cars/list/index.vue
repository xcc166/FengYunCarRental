<template>
  <div>
    <!-- 表格数据 -->
    <CTableData ref="table" :config="tableConfig">
      <!-- 禁启用 -->
      <template v-slot:status="slotData">
        <el-switch
          v-model="slotData.slotData.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="switchChange(slotData.slotData)"
          :disabled="slotData.id == switchDisable"
        ></el-switch>
      </template>
      <!-- 地图 -->
      <template v-slot:lnglat="slotData">
        <el-button type="success" size="mini" @click="showMap(slotData)"
          >查看地图</el-button
        >
      </template>
    </CTableData>

    <!-- 弹窗 -->
    <CShowMapLocation
      :flagVisible.sync="show_map"
      :data="parking_data"
    ></CShowMapLocation>
  </div>
</template>

<script>
import config from "@/config";
import CShowMapLocation from "@c/dialog/showmaplocation.vue";
import CCityarea from "@c/common/cityarea/index.vue";
import { CarsStatus, CarsLock } from "@/api/cars.js";
import CTableData from "@c/tableData/index.vue";
import { address, yearCheckType, energyType } from "@/utils/common.js";
export default {
  name: "CCarsList",
  data() {
    return {
      /* 表格配置 */
      tableConfig: {
        thead: [
          { label: "车牌号", prop: "carsMode" },
          { label: "车辆品牌", prop: "nameCh" },
          {
            label: "车辆LOGO",
            prop: "imgUrl",
            type: "image",
          },
          {
            label: "车辆图片",
            prop: "carsImg",
            type: "image",
          },
          {
            label: "年检",
            prop: "yearCheck",
            type: "function",
            callback: (row, prop) => yearCheckType(row[prop]),
            width: "100px",
          },
          {
            label: "能源类型",
            prop: "energyType",
            type: "function",
            callback: (row, prop) => energyType(row[prop]),
            width: "100px",
          },
          {
            label: "禁启用",
            prop: "status",
            type: "slot",
            slotName: "status",
            width: "100px",
          },
          {
            label: "车辆状态",
            prop: "cars_status",
            type: "function",
            callback: (row) => {
              const carsStatus = config.cars_status;
              const status = carsStatus[row.carsStatus];
              return status ? status.zh : "";
            },
          },
          { label: "停车场", prop: "parkingName" },
          {
            label: "区域",
            prop: "address",
            type: "function",
            callback: (row, prop) => address(row[prop]),
          },
          {
            label: "操作",
            type: "operation",
            width: 300,
            default: {
              deleteButton: true,
              editButton: true,
              editButtonLink: "CCarsAdd",
            },
            buttonGroup: [
              {
                label: "编辑",
                type: "danger",
                event: "link",
                name: "CCarsAdd",
                key: "id",
                value: "id",
                handler: (data) => this.edit(data),
              },
              {
                label: "车辆释放",
                type: "",
                event: "button",
                handler: (data) => this.lock(data),
              },
            ],
          },
        ],
        url: "carsList", // 真实URL请求地址
        data: {
          pageSize: 10,
          pageNumber: 1,
        },
        form_item: [
          { label: "城市", type: "City" },
          {
            label: "类型",
            prop: "parkingType",
            type: "Select",
            width: "120px",
            options: "parking_type",
          },
          {
            label: "禁启用",
            prop: "status",
            type: "Select",
            width: "120px",
            options: "radio_disabled",
          },
          { label: "关键字", type: "Keyword" },
        ],
        form_handler: [
          {
            label: "新增",
            prop: "add",
            type: "success",
            element: "link",
            router: "/carsadd",
          },
          {
            label: "下载",
            prop: "down",
            type: "success",
            element: "button",
            /*  handler: () => this.aaaa(), */
          },
        ],
        form_config: {
          resetButton: true,
        },
      },
      rowID: "",

      parking_data: {},
      /* 地图展示 */
      show_map: false,
      parking_status: config.radio_disabled,
      parking_type: config.parking_type,
      switchDisable: "",
      //分页页码
      pageSize: 10,
      pageNumber: 1,
      form: {
        area: "",
        type: "",
        status: "",
      },
      keyword: "",

      value: [],

      tableData: [],
    };
  },
  components: { CCityarea, CShowMapLocation, CTableData },
  methods: {
    /* 禁启用按钮 */
    switchChange(data) {
      const requrestData = { id: data.id, status: data.status };
      this.switchDisable = data.id;
      CarsStatus(requrestData)
        .then((response) => {
          this.$message({
            type: "success",
            message: response.message,
          });

          this.switchDisable = "";
        })
        .catch((error) => {
          this.switchDisable = "";
        });
    },
    /* 返回类型文本 */
    getType(text) {
      const data = this.parking_type.filter((item) => item.value == text);
      if (data && data.length > 0) {
        return data[0].label;
      }
    },
    /* 车辆释放 */
    lock(data) {
      CarsLock({ id: data.id });
    },
    /* 编辑列表 */
    edit(id) {
      console.log(id);
      this.$router.push({
        name: "CCarsAdd",
        query: {
          //把id传过去，这个id是数据库对应的数据
          id,
        },
      });
    },
    /* 展示地图 */
    showMap(data) {
      this.show_map = true;
      this.parking_data = data.slotData;
      console.log(this.pageSize);
    },

    /* 组件的回调 */
    handleAddressValue(parmas) {
      //将方法和参数穿过来，在子组件定义的
      if (parmas.function) {
        this[parmas.function](parmas.data);
      }
    },
  },

  mounted() {},
};
</script>

<style lang="less"></style>
