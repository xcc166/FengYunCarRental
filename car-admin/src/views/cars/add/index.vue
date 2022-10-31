<template>
  <div class="parking-add">
    <CFormData
      :formItem="form_item"
      :formHandler="form_handler"
      :formData="form_data"
      ref="CFormData"
    >
      <template v-slot:maintain>
        <el-row :gutter="30">
          <el-col :span="6">
            <el-date-picker
              v-model="form_data.maintainDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col :span="6">下次保养日期：2020-12-12</el-col>
        </el-row>
      </template>
      <template v-slot:energy>
        <el-radio-group v-model="form_data.energyType">
          <el-radio
            v-for="item in energyType"
            :key="item.value"
            :label="item.value"
            @change="changeEnergyType"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
        <div
          class="progress-bar-wrap"
          v-if="form_data.energyType == 3 || form_data.energyType == 1"
        >
          <span class="label-text">电量：</span>
          <el-row>
            <el-col :span="10">
              <el-slider v-model="form_data.electric" show-input></el-slider>
            </el-col>
          </el-row>
        </div>
        <div
          class="progress-bar-wrap"
          v-if="form_data.energyType == 3 || form_data.energyType == 2"
        >
          <span class="label-text">油量：</span>
          <el-row>
            <el-col :span="10">
              <el-slider v-model="form_data.oil" show-input></el-slider>
            </el-col>
          </el-row>
        </div>
      </template>
      <template v-slot:carsAttr>
        <CCarAttr
          ref="carsAttr"
          :oil="form_data.oil"
          :initValue="form_data.carsAttr"
          :countKm.sync="form_data.countKm"
          :value.sync="form_data.carsAttr"
        />
      </template>
      <template v-slot:leaseList>
        <el-row :gutter="20">
          <el-col
            :span="4"
            v-for="item in leaseListData"
            :key="item.carsLeaseTypeId"
          >
            <div>{{ item.carsLeaseTypeName }}</div>
            <el-input-number
              v-model="item.price"
              controls-position="right"
              :min="0"
              :max="10000"
              placeholder="请输入价格"
              style="width: 100%"
            ></el-input-number>
          </el-col>
        </el-row>
      </template>
    </CFormData>
  </div>
</template>

<script>
import config from "@/config";
import CFormData from "@c/form/index.vue";
import { GetCarsBrand, GetParking } from "@/api/common";
import CCarAttr from "./component";
import { CarsInfoAdd, CarsInfoEdit, CarsInfoDetailed } from "@/api/cars";
export default {
  name: "CCarsAdd",
  data() {
    return {
      form_item: [
        {
          type: "Select",
          label: "车辆品牌",
          placeholder: "请选择车辆品牌",
          prop: "carsBrandId",
          select_vlaue: "id", // 自有的私有属性
          select_label: "nameCh",
          options: [],
          required: true,
        },
        {
          type: "Select",
          label: "停车场",
          placeholder: "请选择停车场",
          select_vlaue: "id", // 自有的私有属性
          select_label: "parkingName",
          prop: "parkingId",
          options: [],
          required: true,
        },
        {
          type: "Input",
          label: "车辆型号",
          placeholder: "请输入车辆型号",
          prop: "carsMode",
          required: true,
        },

        {
          type: "Input",
          label: "车牌号",
          placeholder: "请输入车牌号",
          prop: "carsNumber",
          required: true,
        },
        {
          type: "Input",
          label: "车架号",
          placeholder: "请输入车架号",
          prop: "carsFrameNumber",
          required: true,
        },
        {
          type: "Upload",
          label: "缩略图",
          placeholder: "请上传缩略图",
          prop: "carsImg",
          required: true,
        },
        {
          type: "Input",
          label: "发动机号",
          placeholder: "请输入发动机号",
          prop: "engineNumber",
          required: true,
        },
        {
          type: "Radio",
          label: "年检",
          placeholder: "请选择年检",
          prop: "yearCheck",
          options: config.year_check,
        },
        {
          type: "Slot",
          slotName: "maintain",
          prop: "maintainDate",
          label: "保养日期",
        },
        {
          type: "Radio",
          label: "档位",
          placeholder: "请选择档位",
          prop: "gear",
          options: config.gear,
        },
        {
          type: "Slot",
          slotName: "energy",
          prop: "energyType",
          label: "能源类型",
        },
        {
          type: "Input",
          label: "可行驶公里",
          prop: "countKm",
        },
        {
          type: "Slot",
          slotName: "carsAttr",
          prop: "carsAttr",
          label: "车辆属性",
        },

        {
          type: "Textarea",
          prop: "content",
          label: "车辆描述",
        },
        {
          type: "Slot",
          slotName: "leaseList",
          prop: "lease",
          label: "租赁价格",
        },
        {
          type: "Disabled",
          label: "禁启用",
          placeholder: "请选择禁启用",
          prop: "status",
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
      form_data: {
        textarea: "",
        parkingId: "",
        carsBrandId: "",
        carsMode: "",
        carsNumber: "",
        carsFrameNumber: "",
        engineNumber: "",
        carsImg: "",
        countKm: "",
        yearCheck: true,
        gear: 1,
        energyType: 2,
        electric: 100,
        oil: 100,
        carsAttr: "",
        content: "",
        maintainDate: "",
        status: true,
      },
      /* 能源类型 */
      energyType: config.energyType,
      textarea: "",
      cars_attr: [],
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change",
          },
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
      /* 用来给编辑按钮使用 */
      id: this.$route.query.id,
    };
  },
  components: { CFormData, CCarAttr },
  beforeMount() {
    this.getCarsBrandList();
    this.getGetParking();
    //车辆详情
    this.getDetailed();
    this.getLeaseList();
  },
  methods: {
    submitForm() {
      //验证carsAttr
      this.formatCarsAttr();
      this.$refs.CFormData.validate((valid) => {
        if (valid) {
          this.id ? this.edit() : this.add();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 获取租赁列表 */
    getLeaseList() {
      if (this.id) {
        return false;
      } // id存在则不请求
      LeaseList().then((response) => {
        const data = response.data.data;
        if (data) {
          this.leaseListData = data;
        }
      });
    },
    /* 添加 */
    add() {
      this.form_data.leasePrice = this.leaseListData;
      CarsInfoAdd(this.form_data).then((response) => {
        this.$message({
          message: response.message,
          type: "success",
        });
        this.$refs.CFormData.resetForm();
        this.cars_attr = [];
      });
    },
    /* 编辑 */
    edit() {
      CarsInfoEdit({
        ...this.form_data,
        id: this.id,
        leasePrice: this.leaseListData,
      }).then((response) => {
        this.$message({
          message: response.message,
          type: "success",
        });
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /* 添加车辆属性 */
    addCarsAttr() {
      this.cars_attr.push({
        attr_key: "",
        attr_value: "",
      });
    },
    /* 删除车辆属性 */
    delCarsAttr(index) {
      this.cars_attr.splice(index, 1);
    },
    /* 对 cars_attr数据格式化*/
    formatCarsAttr() {
      this.$refs.carsAttr.callbackValue();
    },
    /* 获取车辆品牌 */
    getCarsBrandList() {
      GetCarsBrand().then((response) => {
        const data = response.data.data;
        if (data) {
          const carsBrand = this.form_item.filter(
            (item) => item.prop === "carsBrandId"
          );
          if (carsBrand.length > 0) {
            carsBrand[0].options = data;
          }
        }
      });
    },
    /* 获取详情 */
    getDetailed() {
      if (!this.id) {
        return false;
      }
      CarsInfoDetailed({ id: this.id }).then((resposne) => {
        const data = resposne.data;
        if (!data) {
          return false;
        }
        for (const key in data) {
          if (Object.keys(this.form_data).includes(key)) {
            this.form_data[key] = data[key];
          }
        }
        const carsAttr = JSON.parse(data.carsAttr);
        let arr = [];
        for (const key in carsAttr) {
          let json = {};
          (json.attr_key = key), (json.attr_value = carsAttr[key]);
          arr.push(json);
        }
        //更新租赁数据类型
        this.leaseListData = data.leasePrice;
        this.cars_attr = arr;
      });
    },
    /* 获取停车场列表 */
    getGetParking() {
      GetParking().then((response) => {
        const data = response.data.data;
        if (data) {
          const parking = this.form_item.filter(
            (item) => item.prop === "parkingId"
          );
          if (parking.length > 0) {
            parking[0].options = data;
          }
        }
      });
    },
    /* 改变能源类型 */
    changeEnergyType() {
      this.form_data.oil = 0;
      this.form_data.electric = 0;
    },
  },
};
</script>

<style lang="less">
@import "./style.less";
.address-map {
  width: 100%;
  height: 350px;
  border: 1px solid #ccc;
}
</style>
