const path = require("path");
// creates index.html file by a template index.ejs
const HtmlWebpackPlugin = require("html-webpack-plugin");
// cleans dist folder
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// copies the assets folder into dist folder
const CopyWebpackPlugin = require("copy-webpack-plugin");
// output folder location
const distFolder = "./dist";

module.exports = {
  devServer: {
    contentBase: distFolder,
  },
  devtool: "inline-source-map",
  entry: "./src/index.ts",
  mode: "development",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader",
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
        cacheGroups: {
            commons: {
                chunks: "all",
                name: "vendors",
                test: /[\\/]node_modules[\\/]/,
            },
        },
    },
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, distFolder),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new CopyWebpackPlugin([
      { from: "src/assets", to: "assets" },
    ]),
  ],
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ],
  },
};
