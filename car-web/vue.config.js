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
  /** vue3.0内置了webpack所有东西，
   * webpack配置,see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
   **/
  chainWebpack: (config) => {
    /*  const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
        include: ["./src/icons"],
      }); */
  },
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
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require("os").cpus().length > 1,
  /**
   *  PWA 插件相关配置,see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
   */
  pwa: {},

  // webpack-dev-server 相关配置
  devServer: {
    proxy: {
      // 后端的接口：http://old.web-jshtml.cn/api/cars   接口：
      "/apiLogin": {
        target: "http://old.web-jshtml.cn/api/cars", //API服务器的地址
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/apiLogin": "",
        },
      },
      // 本地开发环境请求地址：http://www.web-jshtml.cn/api/cars/getCode/

      // 前端的接口：http://www.web-jshtml/api/cars/web
      "/apiWeb": {
        target: "http://old.web-jshtml.cn/api/cars/web", //API服务器的地址
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/apiWeb": "",
        },
      },
    },
  },
  /**
   * 第三方插件配置
   */
  pluginOptions: {},
});
