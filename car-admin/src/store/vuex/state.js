import { getUsername } from "@/utils/cookies";
export default {
  //sessionStorage的value值
  collapse: JSON.parse(sessionStorage.getItem("collapse")) || false,
  token: "",
  username: "" || getUsername(),
  // table 数据加载标记
  table_loadData_flag: true, // true、false
  // upload token
  upload_token: "",
};
