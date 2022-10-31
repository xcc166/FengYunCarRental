export function GetQiniuToken(data = {}) {
  return service.request({
    method: "post",
    url: "/uploadImgToken/",
    data,
  });
}
