export function getLonLat(e) {
  return {
    //获取经纬度并且组合起来
    lng: e.lnglat.getLng(),
    lat: e.lnglat.getLat(),
    value: e.lnglat.getLng() + "," + e.lnglat.getLat(),
  };
}
