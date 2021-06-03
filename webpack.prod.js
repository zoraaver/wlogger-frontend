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
        {
          from: path.resolve(
            __dirname,
            "public",
            "googlef78e7f6e1c652c24.html"
          ),
          to: path.resolve(__dirname, "build"),
        },
        {
          from: path.resolve(__dirname, "public", "apple-app-site-association"),
          to: path.resolve(__dirname, "build", ".well-known"),
        },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
};

module.exports = merge(webpackCommonConfig, webpackProdConfig);
