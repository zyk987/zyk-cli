import { write } from "utils/file";
import Package from "utils/package";
import Options from "utils/options";

const pkg = Package.getInstance();
const opts = Options.getInstance();

const initBabelConfig = (
  type: string | undefined,
  isCompatibleDecorator: boolean | undefined
) => {
  const babelConfig = `module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3,
      }
    ],
    ${type === "React" ? "@babel/preset-react," : ""}
    "@babel/preset-typescript",
  ],
  plugins: [${
    isCompatibleDecorator
      ? `
    ["@babel/plugin-proposal-decorators", { legacy: true }],`
      : ""
  }
  ],
};
`;

  const browserslistrc = `IE 9 # 兼容IE 9
chrome 35 # 兼容chrome 35
`;

  write("babel.config.js", babelConfig);
  write(".browserslistrc", browserslistrc);
};

export default () => {
  const { devDependencies } = pkg.get();

  const {
    type,
    isCompatibleCss3,
    isCompatibleLowBrowser,
    isCompatibleDecorator,
    optimizationItems,
  } = opts.getAll();

  let newDevDependencies = {
    ...devDependencies,
    "@babel/core": "^7.20.2",
    "@babel/preset-react": "^7.18.6",
    "@babel/preset-typescript": "^7.18.6",
    "copy-webpack-plugin": "^11.0.0",
    "babel-loader": "^9.1.0",
    "css-loader": "^6.7.2",
    "html-webpack-plugin": "^5.5.0",
    less: "^4.1.3",
    "less-loader": "^11.1.0",
    "style-loader": "^3.3.1",
    "webpack-cli": "^5.0.0",
    "webpack-dev-server": "^4.11.1",
    "webpack-merge": "^5.8.0",
    "cross-env": "^7.0.3",
  };

  if (type === "React") {
    newDevDependencies = {
      ...newDevDependencies,
      "@babel/preset-react": "^7.18.6",
    };
  } else if (type === "Vue") {
    newDevDependencies = {
      ...newDevDependencies,
      "vue-loader": "^17.0.1",
    };
  }

  if (isCompatibleCss3) {
    newDevDependencies = {
      ...newDevDependencies,
      "postcss-loader": "^7.0.1",
      autoprefixer: "^10.4.13",
    };
  }

  if (isCompatibleLowBrowser) {
    newDevDependencies = {
      ...newDevDependencies,
      "@babel/preset-env": "^7.20.2",
      "core-js": "^3.26.1",
    };
    initBabelConfig(type, isCompatibleDecorator);
  }

  if (isCompatibleDecorator) {
    newDevDependencies = {
      ...newDevDependencies,
      "@babel/plugin-proposal-decorators": "^7.20.2",
    };
  }

  if (optimizationItems?.includes("isOpenThreadLoader")) {
    newDevDependencies = {
      ...newDevDependencies,
      "thread-loader": "^3.0.4",
    };
  }

  if (optimizationItems?.includes("isPulloutCssFile")) {
    newDevDependencies = {
      ...newDevDependencies,
      "mini-css-extract-plugin": "^2.7.0",
    };
  }

  const initConfig = `const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
${
  optimizationItems?.includes("isPulloutCssFile")
    ? `const MiniCssExtractPlugin = require("mini-css-extract-plugin");`
    : ""
}

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: path.join(__dirname, ${
    type === "React" ? "../src/index.tsx" : "../src/main.ts"
  }),
  output: {
    filename: 'static/js/[name].[contenthash:8].js',
    path: path.join(__dirname, '../dist'),
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [${
      type === "React"
        ? `
      {
        test: /.(ts|tsx)$/,${
          isCompatibleLowBrowser
            ? `
        use: [${
          optimizationItems?.includes("isOpenThreadLoader")
            ? `"thread-loader",`
            : ""
        }"babel-loader"],`
            : `
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript',
            ]
          }
        },`
        }
        include: [path.resolve(__dirname, "../src")],
      },`
        : `
      {
        test: /.(ts|tsx)$/,
        use: 'babel-loader',
      },
      {
        test: /\.vue$/,
        use: ['thread-loader', 'vue-loader'],
        include: [path.resolve(__dirname, "../src")],
      },`
    }
      {
        test: /.(css|less)$/,
        use: [${
          optimizationItems?.includes("isPulloutCssFile")
            ? `
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,`
            : `
          "style-loader"`
        }
          "css-loader",${
            isCompatibleCss3
              ? `
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["autoprefixer"],
              },
            },
          },`
              : ""
          }
          "less-loader",
        ],
        include: [path.resolve(__dirname, "../src")],
      },
      {
        test: /.(png|jpg|jpeg|gif|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: "static/images/[name].[contenthash:8][ext]",
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: "static/fonts/[name].[contenthash:8][ext]",
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: "static/media/[name].[contenthash:8][ext]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      inject: true,
    }),
    new webpack.DefinePlugin({
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
    }),
  ],
  resolve: {
    extensions: [".js", ".tsx", ".ts"],
    alias: { "@": path.join(__dirname, "../src") },
    modules: [path.resolve(__dirname, "../node_modules")],
  },${
    optimizationItems?.includes("isOpenStorageCache")
      ? `
  cache: {
    type: "filesystem",
  },`
      : ``
  }
};
`;

  pkg.set("devDependencies", newDevDependencies);

  write("build/webpack.base.js", initConfig);
};
