const { webpackCommonConfig } = require("./webpack.common");
const { merge } = require("webpack-merge");

const webpackDevConfig = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    host: "localhost",
    contentBase: "./build",
    port: 3000,
    historyApiFallback: true,
  },
};

module.exports = merge(webpackDevConfig, webpackCommonConfig);
