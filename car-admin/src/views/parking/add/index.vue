<template>
  <div class="parking-add">
    <CFormData
      :formItem="form_item"
      :formHandler="form_handler"
      :formData="form_data"
      ref="CFormData"
    >
      <template v-slot:city>
        <CCityarea
          :cityAreaValue.sync="form_data.area"
          @handleAddressValue="handleAddressValue"
          :mapLocation="mapLocation"
          ref="CityArea"
        ></CCityarea>
      </template>
      <template v-slot:amap>
        <div class="address-map">
          <CAmap
            @lonlat="getLonLatValue"
            ref="CAmap"
            :options="option_map"
            @callback="callbackComponent"
          ></CAmap>
        </div>
      </template>
    </CFormData>
  </div>
</template>
<script>
import CAmap from "../../amap/index.vue";
import CCityarea from "@c/common/cityarea/index.vue";
import config from "@/config";
import { ParkingAdd, ParkingDetailed, ParkingEdit } from "@/api/parking.js";
import CFormData from "@c/form/index.vue";
export default {
  name: "CAdd",
  data() {
    let validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入停车场名称"));
      } else {
        callback();
      }
    };
    let validateNumber = (rule, value, callback) => {
      const regNumber = /^[0-9]*$/;
      if (!value) {
        callback(new Error("请输入可停放车辆"));
      } else if (!regNumber.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据配置
      form_data: {
        parkingName: "",
        area: "",
        address: "",
        type: "",
        carsNumber: "",
        status: "",
        lnglat: "",
      },
      // 表单配置
      form_item: [
        {
          type: "Input",
          label: "停车场名称",
          placeholder: "请输入停车场名称",
          prop: "parkingName",
          width: "200px",
          validator: [{ validator: validatePass, trigger: "change" }],
        },
        {
          type: "Slot",
          slotName: "city",
          prop: "area",
          label: "区域",
        },
        {
          type: "Input",
          label: "详细地址",
          placeholder: "请输入详细地址",
          prop: "address",
          required: true,
        },
        {
          type: "Radio",
          label: "类型",
          prop: "type",
          options: config.parking_type,
          required: true,
        },
        {
          type: "Input",
          label: "可停放车辆",
          placeholder: "请输入数字类型",
          prop: "carsNumber",
          validator: [{ validator: validateNumber, trigger: "change" }],
        },
        {
          type: "Radio",
          label: "禁启用",
          prop: "status",
          options: config.radio_disabled,
        },
        { type: "Slot", slotName: "amap", label: "位置" },
        {
          type: "Input",
          label: "经纬度",
          placeholder: "请输入详细地址",
          prop: "lnglat",
          disabled: true,
        },
      ],
      form_handler: [
        {
          label: "确定",
          key: "submit",
          type: "danger",
          //提交表单
          handler: () => this.submitForm(),
        },
        { label: "重置", key: "reset" },
      ],
      // id
      id: this.$route.query.id,
      mapLocation: true,
      // 地图配置
      option_map: {
        mapLoad: true,
      },
      status: config.radio_disabled,
      type: config.parking_type,
      // 按钮加载
      button_loading: false,
    };
  },
  components: { CAmap, CCityarea, CFormData },
  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data);
      }
    },
    /* 地图加载完成 */
    mapLoad() {
      console.log(111);
      this.getDetaile();
    },
    /* 提交表单 */
    submitForm() {
      this.$refs.CFormData.$refs.form.validate((valid) => {
        if (valid) {
          this.id ? this.editParking() : this.addParking();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 修改停车场 */
    editParking() {
      let requestData = JSON.parse(JSON.stringify(this.form_data));
      requestData.id = this.id;
      //在进入这个方法的时候将按钮设置为加载中防止连续点击
      this.button_loading = true;
      //这个Parkingadd的参数就是form表单的值
      ParkingEdit(requestData)
        .then((response) => {
          this.$message({
            type: "primary",
            message: response.message,
          });
          //在成功后将按钮改回来
          this.button_loading = false;
          this.$router.push({
            name: "CParking",
          });
        })
        .catch(() => {
          this.button_loading = false;
        });
    },
    /*新增停车场 */
    addParking() {
      //在进入这个方法的时候将按钮设置为加载中防止连续点击
      this.button_loading = true;
      //这个Parkingadd的参数就是form表单的值
      ParkingAdd(this.form_data)
        .then((response) => {
          this.$message({
            type: "primary",
            message: response.message,
          });
          //在成功后将按钮改回来
          this.button_loading = false;
          this.resetForm();
        })
        .catch(() => {
          this.button_loading = false;
        });
    },
    /* 获取详情 */
    getDetaile() {
      if (this.id) {
        return false;
      }
      ParkingDetailed({ id: this.id }).then((response) => {
        const data = response.data;
        //这个response就是对应数据库id的数据
        for (const key in data) {
          if (Object.keys(this.form_data).includes(key)) {
            this.form_data[key] = data[key];
          }
        }

        //设置覆盖物
        const splitLnglat = data.lnglat.split(",");
        const lnglat = {
          lng: splitLnglat[0],
          lat: splitLnglat[1],
        };
        console.log(splitLnglat);
        this.$refs.CAmap.setMarker(lnglat);

        //初始化省市区
        this.$refs.CityArea.initDefault(data.region);
      });
    },
    /* 清除表单 */
    resetForm() {
      this.$refs.form.resetFields();
      //清除选项框里面的值
      this.$refs.CityArea.clear();
      //清除地图图标
      this.$refs.CAmap.clearMarker();
    },
    getLonLatValue(data) {
      //获取点击目标的经纬度
      const value = data.data.lonlat.value;
      this.form_data.lnglat = value;
    },
    handleAddressValue(parmas) {
      //将方法和参数穿过来，在子组件定义的
      if (parmas.function) {
        this[parmas.function](parmas.data);
      }
    },
    setMapCenter(data) {
      this.$refs.CAmap.setMapCenter(data.address);
      console.log(111);
    },
  },
};
</script>

<style lang="less" scoped>
.address-map {
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
}
</style>
