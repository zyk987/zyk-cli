import { write } from "utils/file";
import Package from "utils/package";
import Options from "utils/options";

const pkg = Package.getInstance();
const opts = Options.getInstance();

export default () => {
  const { devDependencies } = pkg.get();
  const { optimizationItems } = opts.getAll();

  let newDevDependencies = { ...devDependencies };

  if (optimizationItems?.includes("isCompressJsAndCssFile")) {
    newDevDependencies = {
      ...newDevDependencies,
      "css-minimizer-webpack-plugin": "^4.2.2",
    };
  }

  if (optimizationItems?.includes("isTreeShakingCss")) {
    newDevDependencies = {
      ...newDevDependencies,
      "glob-all": "^3.3.1",
      "purgecss-webpack-plugin": "^4.1.3",
    };
  }

  if (optimizationItems?.includes("isCreateGzipFile")) {
    newDevDependencies = {
      ...newDevDependencies,
      "compression-webpack-plugin": "^10.0.0",
    };
  }
  const initConfig = `const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
${
  optimizationItems?.some((v: string) =>
    ["isPulloutCssFile", "isTreeShakingCss"].includes(v)
  )
    ? `const MiniCssExtractPlugin = require("mini-css-extract-plugin");`
    : ""
}${
    optimizationItems?.includes("isCompressJsAndCssFile")
      ? `
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin"); // 内置插件，如果找不到模块请手动安装`
      : ""
  }${
    optimizationItems?.includes("isTreeShakingCss")
      ? `
const globAll = require("glob-all");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");`
      : ``
  }${
    optimizationItems?.includes("isCreateGzipFile")
      ? `
const CompressionPlugin = require("compression-webpack-plugin");`
      : ``
  }

module.exports = merge(baseConfig, {
  mode: "production",
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"),
          to: path.resolve(__dirname, "../dist"),
          filter: (source) => {
            return !source.includes("index.html");
          },
        },
      ],
    }),${
      optimizationItems?.includes("isPulloutCssFile")
        ? `
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
    }),`
        : ""
    }${
    optimizationItems?.includes("isTreeShakingCss")
      ? `
    new PurgeCSSPlugin({
      paths: globAll.sync([
        \`\${path.join(__dirname, "../src")}/**/*.tsx\`,
        path.join(__dirname, "../public/index.html"),
      ]),
      safelist: {
        standard: [/^(ant-|el-)/],
      },
    }),`
      : ``
  }${
    optimizationItems?.includes("isCreateGzipFile")
      ? `
    new CompressionPlugin({
      test: /.(js|css)$/,
      filename: "[path][base].gz",
      algorithm: "gzip",
      threshold: 10240,
      minRatio: 0.8,
    }),`
      : ``
  }
  ],
  optimization: {${
    optimizationItems?.includes("isCompressJsAndCssFile")
      ? `
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"],
          },
        },
      }),
    ],`
      : ""
  }
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          name: "vendors",
          minChunks: 1, 
          chunks: "initial",
          minSize: 0,
          priority: 1,
        },
        commons: {
          name: "commons",
          minChunks: 2,
          chunks: "initial",
          minSize: 0,
        },
      },
    },
  },
});
`;

  pkg.set("devDependencies", newDevDependencies);

  write("build/webpack.prod.js", initConfig);
};
