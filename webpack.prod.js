const { webpackCommonConfig } = require("./webpack.common");
const { merge } = require("webpack-merge");

const webpackProdConfig = {
  mode: "production",
};

module.exports = merge(webpackCommonConfig, webpackProdConfig);
