const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { EnvironmentPlugin } = require("webpack");

exports.webpackCommonConfig = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.[fullhash].js",
    path: path.resolve(__dirname, "build"),
    clean: true,
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
    }),
    new EnvironmentPlugin({ NODE_ENV: "development" }),
  ],
  resolve: {
    modules: [__dirname, "src", "node_modules"],
    extensions: ["*", ".js", ".ts", ".tsx", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        loader: require.resolve("ts-loader"),
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.less$/i,
        loader: "less-loader", // compiles Less to CSS
      },
    ],
  },
};
