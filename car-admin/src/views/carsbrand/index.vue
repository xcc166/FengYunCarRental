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
    </CTableData>
    <!-- dialog 弹窗 -->
    <CAddcarbrand
      :flagVisible.sync="dialog_show"
      :data="diaData"
      @callback="callbackComponent"
    ></CAddcarbrand>
  </div>
</template>

<script>
import CAddcarbrand from "@c/dialog/addcarbrand.vue";
import CTableData from "@c/tableData/index.vue";
import { BrandDelete, BrandStatus } from "@/api/brand.js";
export default {
  name: "CCarsbrand",
  components: { CAddcarbrand, CTableData },
  data() {
    return {
      //dia数据
      diaData: {},
      // 表格配置
      tableConfig: {
        thead: [
          {
            label: "LOGO",
            prop: "imgUrl",
            type: "image",
            width: 150,
          },
          {
            label: "车辆品牌",
            prop: "nameCh",
            type: "function",
            callback: (row, prop) => `${row.nameCh}/${row.nameEn}`,
          },
          {
            label: "禁启用",
            prop: "status",
            type: "slot",
            slotName: "status",
          },
          {
            label: "操作",
            type: "operation",
            width: 200,
            default: {
              deleteButton: true,
            },
            buttonGroup: [
              {
                label: "编辑",
                type: "danger",
                event: "button",
                handler: (data) => this.edit(data),
              },
            ],
            slotName: "operation",
          },
        ],
        url: "brandList", // 真实URL请求地址
        data: {
          pageSize: 10,
          pageNumber: 1,
        },
        form_item: [
          {
            label: "车辆品牌",
            prop: "brand",
            type: "Input",
            width: "150px",
            options: "parking_type",
            placeholder: "请输入车辆品牌",
          },
        ],
        form_handler: [
          {
            label: "新增车辆品牌",
            prop: "add",
            type: "danger",
            element: "button",
            handler: () => {
              this.dialog_show = true;
            },
          },
        ],
        form_config: {
          resetButton: true,
        },
      },
      //siwtch是否使用
      switchDisable: "",
      rowID: "",
      dialog_show: false,
      dataId: "",
      /* 数据部分 */
      form: {
        brand: "",
      },
      value: [],
    };
  },
  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function]();
      }
    },
    /* 搜索 */
    searchBrand() {
      const requestData = {
        pageSize: 10,
        pageNumber: 1,
      };
      if (this.form.brand) {
        requestData.brand = this.form.brand;
      }
      /* 调用table的方法 */
      this.$refs.table.requestData(requestData);
    },
    /* 禁启用按钮 */
    switchChange(data) {
      const requrestData = { id: data.id, status: data.status };
      this.switchDisable = data.id;
      console.log(requrestData);
      console.log(data);
      BrandStatus(requrestData)
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
    /* 删除列表 */
    deleteParking(id) {
      this.$confirm("此操作将删除该该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.rowID = id;
          BrandDelete({ id })
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
    edit(data) {
      console.log(data);
      this.diaData = JSON.parse(JSON.stringify(data));
      this.dialog_show = true;
    },
  },
};
</script>

<style lang="less" scoped></style>
