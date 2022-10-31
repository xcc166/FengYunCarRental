<template>
  <div>
    <!-- 头部 -->
    <div class="filter-form">
      <el-row>
        <el-col :span="22">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="区域">
              <CCityarea
                :cityAreaValue.sync="form.area"
                @handleAddressValue="handleAddressValue"
                ref="CityArea"
              ></CCityarea>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="form.type" class="width-120">
                <el-option
                  v-for="(item, index) in parking_type"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="禁启用">
              <el-select v-model="form.status" class="width-120">
                <el-option
                  v-for="(item, index) in parking_status"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字">
              <el-select v-model="searchKey" class="width-120">
                <el-option label="停车场名称" value="parkingName"></el-option>
                <el-option label="详细区域" value="address"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="keyword"
                placeholder="请输入关键字按Enter搜索"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">搜索</el-button>
            </el-form-item>
          </el-form></el-col
        >
        <el-col :span="2">
          <router-link to="/add">
            <el-button type="danger">新增停车场</el-button>
          </router-link>
        </el-col>
      </el-row>
    </div>
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
      <!--操作-->
      <!-- <template v-slot:operation="slotData">
        <el-button type="danger" size="mini" @click="edit(slotData.id)"
          >编辑</el-button
        >
        <el-button
          size="mini"
          :loading="slotData.id == rowID"
          @click="deleteParking(slotData.id)"
          >删除</el-button
        >
      </template> -->
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
import { ParkingStatus, ParkingDelete } from "@/api/parking.js";
import CTableData from "@c/tableData/index.vue";
import { address, parkingType } from "@/utils/common.js";
export default {
  name: "CParking",
  data() {
    return {
      /* 表格配置 */
      tableConfig: {
        thead: [
          { label: "停车场名称", prop: "parkingName" },
          {
            label: "类型",
            prop: "type",
            type: "function",
            callback: (row, prop) => parkingType(row[prop]),
          },
          {
            label: "区域",
            prop: "address",
            type: "function",
            callback: (row, prop) => address(row[prop]),
          },
          { label: "可停放车辆", prop: "carsNumber" },
          {
            label: "禁启用",
            prop: "status",
            type: "slot",
            slotName: "status",
          },
          {
            label: "查看位置",
            prop: "lnglat",
            type: "slot",
            slotName: "lnglat",
          },
          {
            label: "操作",
            type: "operation",
            default: {
              deleteButton: true,
              editButton: true,
              editButtonLink: "ParkingAdd",
            },
          },
        ],
        url: "parkingList", // 真实URL请求地址
        data: {
          pageSize: 10,
          pageNumber: 1,
        },
      },
      rowID: "",
      /* 表格加载延迟 */
      tableLoading: true,
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
      searchKey: "",
      value: [],
      options: [
        {
          value: "111",
          label: "广东",
          children: [
            { value: "111", label: "深圳" },
            { value: "111", label: "广州" },
          ],
        },
      ],
      tableData: [],
    };
  },
  components: { CCityarea, CShowMapLocation, CTableData },
  methods: {
    /* 禁启用按钮 */
    switchChange(data) {
      const requrestData = { id: data.id, status: data.status };
      this.switchDisable = data.id;
      ParkingStatus(requrestData)
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
    /* 删除列表 */
    deleteParking(id) {
      this.$confirm("此操作将删除该该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.rowID = id;
          ParkingDelete({ id })
            .then((response) => {
              this.$message({
                type: "success",
                message: response.message,
              });
              //调用table的方法
              this.$refs.table.requestData();
              this.rowID = "";
              /*  //删除成功重新调用请求列表的接口
            this.getParkingList(); */
            })
            .catch(() => {
              this.rowID = "";
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /* 编辑列表 */
    edit(id) {
      console.log(id);
      this.$router.push({
        name: "CAdd",
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
    /* 搜索按钮 */
    onSearch() {
      this.tableLoading = true;
      const requestData = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      };
      //对form操作
      const filterData = JSON.parse(JSON.stringify(this.form)); //深拷贝
      for (let key in filterData) {
        if (filterData[key]) {
          //将不必需要的数据放在参数内
          requestData[key] = filterData[key];
        }
      }
      //关键字
      if (this.keyword && this.searchKey) {
        requestData[this.searchKey] = this.keyword;
      }
      this.$refs.table.requestData(requestData);
    },
    /* 组件的回调 */
    handleAddressValue(parmas) {
      //将方法和参数穿过来，在子组件定义的
      if (parmas.function) {
        this[parmas.function](parmas.data);
      }
    },

    /*  获取parking列表，渲染到表格内 */
    /* getParkingList() {
      this.tableLoading = true;
      const requestData = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      };
      //对form操作
      const filterData = JSON.parse(JSON.stringify(this.form)); //深拷贝
      for (let key in filterData) {
        if (filterData[key]) {
          //将不必需要的数据放在参数内
          requestData[key] = filterData[key];
        }
      }
      //关键字
      if (this.keyword && this.searchKey) {
        requestData[this.searchKey] = this.keyword;
      }
      ParkingList(requestData)
        .then((response) => {
          const data = response.data.data;
          if (data) {
            this.tableData = data;
            this.total = response.data.total;
          }
          console.log(response);
          this.tableLoading = false;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    }, */
  },

  mounted() {},
};
</script>

<style lang="less"></style>
