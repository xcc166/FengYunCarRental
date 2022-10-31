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
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :cell-style="{ 'text-align': 'center' }"
      v-loading="tableLoading"
    >
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="parkingName" label="停车场名称"> </el-table-column>
      <el-table-column prop="type" label="类型">
        <template v-slot="scope">
          <span>{{ getType(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="区域"> </el-table-column>
      <el-table-column prop="carsNumber" label="可停放车辆"> </el-table-column>
      <el-table-column prop="disabled" label="禁启用">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.disabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="2"
            inactive-value="1"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="area" label="查看位置">
        <template v-slot="scope">
          <el-button type="success" size="mini" @click="showMap(scope.row)"
            >查看地图</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="danger" size="mini" @click="edit(scope.row.id)"
            >编辑</el-button
          >
          <el-button size="mini" @click="deleteParking(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-row>
      <el-col :span="4"></el-col>
      <el-col :span="20">
        <el-pagination
          class="pull-right"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>

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
import { ParkingList, ParkingDelete } from "@/api/parking.js";
export default {
  name: "CParking",
  data() {
    return {
      tableLoading: true,
      parking_data: {},
      /* 地图展示 */
      show_map: false,
      parking_status: config.parking_status,
      parking_type: config.parking_type,
      total: 0,
      currentPage: 1,
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
  components: { CCityarea, CShowMapLocation },
  methods: {
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
          ParkingDelete({ id }).then((response) => {
            this.$message({
              type: "success",
              message: response.message,
            });
            //删除成功重新调用请求列表的接口
            this.getParkingList();
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
      this.parking_data = data;
      console.log(data);
    },
    /* 搜索按钮 */
    onSearch() {
      //在这里面将form循环判断
      this.getParkingList();
    },
    /* 组件的回调 */
    handleAddressValue(parmas) {
      //将方法和参数穿过来，在子组件定义的
      if (parmas.function) {
        this[parmas.function](parmas.data);
      }
    },

    /*  获取parking列表，渲染到表格内 */
    getParkingList() {
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
    },
    /* 处理传到数据库的page和number */
    handleSizeChange(val) {
      this.pageSize = val;
      this.getParkingList();
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getParkingList();
    },
  },
  beforeMount() {
    this.getParkingList();
  },
  mounted() {},
};
</script>

<style lang="less"></style>
