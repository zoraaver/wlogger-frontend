const { webpackCommonConfig } = require("./webpack.common");
const { merge } = require("webpack-merge");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

const webpackProdConfig = {
  mode: "production",
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public", "_redirects"),
          to: path.resolve(__dirname, "build"),
        },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
};

module.exports = merge(webpackCommonConfig, webpackProdConfig);
