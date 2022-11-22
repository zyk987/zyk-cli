import { write } from "utils/file";
import Package from "utils/package";
import Options from "utils/options";

const pkg = Package.getInstance();
const opts = Options.getInstance();

export default () => {
  const { devDependencies } = pkg.get();
  const { type } = opts.getAll();

  type === "React"
    ? pkg.set("devDependencies", {
        ...devDependencies,
        "@pmmmwh/react-refresh-webpack-plugin": "^0.5.9",
        "react-refresh": "^0.14.0",
      })
    : pkg.set("devDependencies", {
        ...devDependencies,
      });

  const initConfig = `const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
${
  type === "React"
    ? `const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");`
    : ``
}

module.exports = merge(baseConfig, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    port: 8080,
    compress: false,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "../public"),
    },
  },
  plugins: [${
    type === "React"
      ? `new ReactRefreshWebpackPlugin(), `
      : `new webpack.HotModuleReplacementPlugin(),`
  }],
});
`;

  write("build/webpack.dev.js", initConfig);
};
