import config from "@/config/index";
/** 省市区街道 */
export function address(value) {
  console.log(value);
  let address = value;
  let addressInfo = "";
  if (address) {
    let split = address.split(",");
    addressInfo += split[0];
    // 街道
    if (split[1]) {
      addressInfo += `<br/>${split[1]}`;
    }
  }
  return addressInfo;
}

/** 停车场类型 */
export function parkingType(value) {
  const data = config.parking_type_json[value];
  if (data) {
    return data.label;
  }
}
/* 年检 */
export function yearCheckType(value) {
  const data = config.year_check[value];
  const filterData = data.filter((item) => item.value === value);
  if (filterData.length > 0) {
    return filterData[0].label;
  }
  return "";
}
/* 能源类型 */
export function energyType(value) {
  const data = config.energyType[value];
  const filterData = data.filter((item) => item.value === parseInt(value));
  if (filterData.length > 0) {
    return filterData[0].label;
  }
  return "";
}
