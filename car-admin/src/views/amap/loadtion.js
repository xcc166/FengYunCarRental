export function addressSetMapCenter(address, map) {
  //使用要在apma配置文件内设置安全秘钥
  const geocoder = new AMap.Geocoder();
  geocoder.getLocation(address, function (status, result) {
    console.log(status, result);
    if (status === "complete" && result.info == "OK") {
      let lat = result.geocodes[0].location.lat;
      let lng = result.geocodes[0].location.lng;
      map.setCenter([lng, lat]);
    } else {
      console.error("根据地址查询位置失败");
    }
  });
}
