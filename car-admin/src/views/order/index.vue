<template>
  <div>
    <CTabalData ref="table" :config="table_config">
      <!--禁启用-->
      <template v-slot:status="slotData">
        <el-switch
          :disabled="slotData.data.id == switch_disabled"
          @change="switchChange(slotData.data)"
          v-model="slotData.data.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </template>
    </CTabalData>
    <CShowMapLocation :flagVisible.sync="map_show" :data="parking_data" />
  </div>
</template>
<script>
// 组件
import CShowMapLocation from "@c/dialog/showmaplocation.vue";
import CTabalData from "@c/tableData";
// API
import {
  OrderWait,
  OrderOvertime,
  OrderOver,
  OrderCancel,
  OrderReturn,
} from "@/api/order";
import config from "@/config";
export default {
  name: "COrder",
  data() {
    return {
      // 表格配置
      table_config: {
        thead: [
          { label: "订单号", prop: "order_no" },
          {
            label: "状态",
            prop: "order_status",
            type: "function",
            callback: (row) => {
              const orderStatus = config.order_status;
              const status = orderStatus[row.order_status];
              return status ? status.zh : "";
            },
          },
          {
            label: "日期",
            prop: "create_date",
            type: "function",
            callback: (row) => {
              // 空数据时
              if (!row.create_date) {
                return "";
              }
              // 分割日期
              const dateSplit = row.create_date.split(" ");
              return `${dateSplit[0]} <br/> ${dateSplit[1]}`;
            },
          },
          {
            label: "金额",
            prop: "amount",
          },

          {
            label: "操作",
            type: "operation",
            width: 550,
            default: {
              deleteButton: true,
              editButton: true,
              editButtonLink: "CarsAdd",
            },
            buttonGroup: [
              {
                label: "编辑",
                type: "danger",
                event: "link",
                name: "CarsAdd",
                key: "id",
                value: "id",
              },
              {
                label: "待取车",
                type: "",
                event: "button",
                handler: (data) => this.orderWait(data),
              },
              {
                label: "超时",
                type: "",
                event: "button",
                handler: (data) => this.orderOvertime(data),
              },
              {
                label: "完成",
                type: "",
                event: "button",
                handler: (data) => this.orderOver(data),
              },
              {
                label: "取消",
                type: "",
                event: "button",
                handler: (data) => this.orderCancel(data),
              },
              {
                label: "待还车",
                type: "",
                event: "button",
                handler: (data) => this.ordrerReturn(data),
              },
            ],
          },
        ],
        url: "orderList", // 真实URL请求地址
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
            router: "/carsAdd",
          },
          {
            label: "下载",
            prop: "down",
            type: "success",
            element: "button",
            handler: () => this.aaaa(),
          },
        ],
        form_config: {
          resetButton: true,
        },
      },
      switch_disabled: "",
      switch_flag: false,
      // 禁启用
      parking_status: config.radio_disabled,
      // 停车场类型
      parking_type: config.parking_type,
      // 地图显示
      map_show: false,
      parking_data: {},
      table_loading: false,
      rowId: "",
    };
  },
  components: { CShowMapLocation, CTabalData },
  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data);
      }
    },
    /** 禁启用 */
    switchChange(data) {
      if (this.switch_flag) {
        return false;
      }
      const requestData = {
        id: data.id,
        status: data.status,
      };
      // this.switch_flag = true;
      this.switch_disabled = data.id; // 第一种方式：组件本身的属性处理
      CarsStatus(requestData)
        .then((response) => {
          this.$message({
            type: "success",
            message: response.message,
          });
          this.switch_disabled = "";
          // this.switch_flag = false;
        })
        .catch((error) => {
          this.switch_disabled = "";
          // this.switch_flag = false;
        });
    },
    /** 显示地图 */
    showMap(data) {
      this.map_show = true;
      this.parking_data = data;
    },
    aaaa() {
      alert(1111);
    },
    orderWait(data) {
      OrderWait({
        order_no: data.order_no,
        cars_id: data.cars_id,
      }).then((response) => {
        this.loadData();
      });
    },
    orderOvertime(data) {
      OrderOvertime({
        order_no: data.order_no,
        cars_id: data.cars_id,
      }).then((response) => {
        this.loadData();
      });
    },
    orderOver(data) {
      OrderOver({
        order_no: data.order_no,
        cars_id: data.cars_id,
      }).then((response) => {
        this.loadData();
      });
    },

    orderCancel(data) {
      OrderCancel({
        order_no: data.order_no,
        cars_id: data.cars_id,
      }).then((response) => {
        this.loadData();
      });
    },
    ordrerReturn(data) {
      OrderReturn({
        order_no: data.order_no,
        cars_id: data.cars_id,
      }).then((response) => {
        this.loadData();
      });
    },
    loadData() {
      this.$refs.table.requestData();
    },
  },

  // DOM元素渲染之前（生命周期）
  beforeMount() {},
  // DOM元素渲染完成（生命周期）
  mounted() {},
};
</script>
<style lass="less" scoped></style>
