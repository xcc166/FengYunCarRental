const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  // 基本路径
  publicPath: process.env.NODE_ENV === "production" ? "" : "./",
  // 输出文件目录
  outputDir: process.env.NODE_ENV === "production" ? "dist" : "devdist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  configureWebpack: (config) => {
    config.resolve = {
      // 配置解析别名
      extensions: [".js", ".json", ".vue"], // 自动添加文件名后缀
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@c": path.resolve(__dirname, "./src/components"),
      },
    };
  },
  devServer: {
    proxy: {
      "/devapi": {
        target: "http://old.web-jshtml.cn/api/cars",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/devapi": "",
        },
      },

      // http://www.web-jshtml.cn/api/vue3  /api/getCode
    },
  },
});
