<template>
  <div>
    <!-- CFormSearch搜索 -->
    <CFormSearch
      v-if="tableConfig.search_form"
      :formItme="tableConfig.form_item"
      :formHandler="tableConfig.form_handler"
      :formConfig="tableConfig.form_config"
      @callbackComponent="callbackComponent"
    ></CFormSearch>
    <!-- 额外的slot -->
    <slot name="content"></slot>
    <!-- 表格数据 -->
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        v-show="tableConfig.checkbox"
        type="selection"
        width="35"
      ></el-table-column>
      <div v-for="item in tableConfig.thead" :key="item.prop">
        <!-- 回調 -->
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          v-if="item.type === 'function'"
          :width="item.width"
        >
          <template v-slot="scope">
            <!-- 用v-html是防止把换行符当成文本 -->
            <span v-html="item.callback && item.callback(scope.row, item.prop)"
              >111</span
            >
          </template></el-table-column
        >
        <!-- 插槽slot -->
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          v-else-if="item.type === 'slot'"
          :width="item.width"
        >
          <template v-slot="scope">
            <slot :name="item.slotName" :slotData="scope.row"></slot>
          </template>
        </el-table-column>
        <!-- switch -->
        <el-table-column
          v-else-if="item.type === 'switch'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
          <template v-slot="scope">
            <el-switch
              @change="item.handler && item.handler($event, scope.row)"
              v-model="scope.row[item.prop]"
              :active-value="item.on || true"
              :inactive-value="item.off || false"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
            <slot
              :name="item.slotName"
              :data="scope.row"
              :type="item.prop"
            ></slot>
          </template>
        </el-table-column>
        <!-- 图标显示 -->
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          v-else-if="item.type === 'image'"
          :width="item.width"
        >
          <template v-slot="scope">
            <img
              :url="scope.row[item.prop]"
              :width="item.imgWidth || 50"
              alt=""
            />
          </template>
        </el-table-column>
        <!--操作 -->
        <el-table-column
          v-else-if="item.type === 'operation'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
          <template v-slot="scope">
            <!--按钮组-->
            <template v-if="item.buttonGroup && item.buttonGroup.length > 0">
              <template v-for="button in item.buttonGroup">
                <!-- 事件 -->
                <el-button
                  v-if="button.event === 'button'"
                  :type="button.type"
                  :key="button.id"
                  @click="button.handler && button.handler(scope.row)"
                  size="small"
                >
                  {{ button.label }}
                </el-button>
                <!-- 路由跳转 -->
                <router-link
                  v-if="button.event === 'link'"
                  :key="button.id"
                  :to="{
                    name: button.name,
                    query: { [button.key]: scope.row[button.value || 'id'] },
                  }"
                  class="mr-10"
                >
                  <el-button :type="button.type" size="small">{{
                    button.label
                  }}</el-button>
                </router-link>
              </template>
            </template>
            <!--额外-->
            <slot
              v-if="item.slotName"
              :name="item.slotName"
              :data="scope.row"
            ></slot>
            <!--删除-->
            <el-button
              size="small"
              v-if="item.default && item.default.deleteButton"
              :loading="scope.row[item.default.deleteKey || 'id'] == rowID"
              @click="delConfirm(scope.row[item.default.deleteKey || 'id'])"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <!-- 纯文本输入 -->
        <el-table-column
          v-else
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        ></el-table-column>
      </div>
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
  </div>
</template>

<script>
import CFormSearch from "@c/formSearch";
import { GetTableData, Delete } from "@/api/common.js";
export default {
  name: "CTableData",
  data() {
    return {
      /* 表格加载 */
      tableLoading: false,
      total: 0,
      currentPage: 1,
      tableData: [],
      tableConfig: {
        // 初始化是否请求接口
        isRequest: true,
        thead: [],
        checkbox: true,
        url: "",
        pagination: true,
        data: {},
        search_form: true,
        // form
        form_item: [],
        form_handler: [],
        form_config: {
          resetButton: false,
        },
      },
      rowID: "",
    };
  },
  components: {
    CFormSearch,
  },
  beforeMount() {
    /*  this.getParkingList(), */
    this.initConfig();
  },
  methods: {
    /* 回调函数 */
    callbackComponent(params) {
      //params.function=search
      this[params.function](params.data);
    },
    /* 搜索 */
    search(data) {
      const searchDate = data;
      //下面两行的意思是指将页面重新到第一页
      searchDate.pageNumber = 1;
      searchDate.pageSize = 10;
      this.requestData(searchDate);
    },
    /* 处理传到数据库的page和number */
    handleSizeChange(val) {
      this.tableConfig.data.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.tableConfig.data.pageNumber = val;
      this.loadData();
    },

    /* table的配置 */
    initConfig() {
      for (let key in this.config) {
        if (Object.keys(this.tableConfig).includes(key)) {
          this.tableConfig[key] = this.config[key];
        }
      }
      console.log(this.tableConfig);

      //配置完成后读取数据接口
      this.tableConfig.isRequest && this.loadData();
    },
    /* 加载表格数据 */
    loadData() {
      let requestData = {
        url: this.tableConfig.url,
        data: this.tableConfig.data,
      };
      GetTableData(requestData)
        .then((response) => {
          this.tableLoading = false;
          const data = response.data;
          if (data) {
            this.tableData = data.data;
          }
          //分页的total
          this.total = data.total;
        })
        .catch((error) => {
          this.tableLoading = false;
        });
    },

    /* 给外部组件调用的方法 */
    requestData(params = "") {
      if (params) {
        this.tableConfig.data = params;
      }
      //调用方法
      this.loadData();
    },

    /* 删除列表 */
    delConfirm(id) {
      console.log(111);
      this.$confirm("此操作将删除该该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.rowID = id;
          let requestData = {
            url: this.tableConfig.url + "Delete",
            data: { id },
          };
          Delete(requestData)
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
  },
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    config: {
      handler(newValue) {
        this.initConfig();
      },
      immediate: true,
    },
    "$store.state.table_loadData_flag": {
      handler(newValue) {
        this.loadData();
      },
      // immediate: true // 初始化监听
    },
  },
};
</script>

<style lang="less" scoped>
.mr-10 {
  margin-right: 10px;
}
</style>
