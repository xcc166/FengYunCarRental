export function formatRequestData(keyData, requestData) {
  const data = {};
  for (let key in keyData) {
    if (Object.keys(requestData).includes(key)) {
      data[key] = requestData[key];
    }
  }
  return data;
}
