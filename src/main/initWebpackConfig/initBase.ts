import { write } from "utils/file";
import Package from "utils/package";
import Options from "utils/options";

const pkg = Package.getInstance();
const opts = Options.getInstance();

export default () => {
  const { devDependencies } = pkg.get();

  const { type, isCompatibleCss3 } = opts.getAll();

  let newDevDependencies = { ...devDependencies };

  if (type === "React") {
    newDevDependencies = {
      ...newDevDependencies,
      "@babel/core": "^7.20.2",
      "@babel/preset-react": "^7.18.6",
      "@babel/preset-typescript": "^7.18.6",
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
  } else if (type === "Vue") {
    newDevDependencies = {
      ...newDevDependencies,
      "@babel/core": "^7.20.2",
      "@babel/preset-react": "^7.18.6",
      "@babel/preset-typescript": "^7.18.6",
      "babel-loader": "^9.1.0",
    };
  }

  if (isCompatibleCss3) {
    newDevDependencies = {
      ...newDevDependencies,
      "postcss-loader": "^7.0.1",
      autoprefixer: "^10.4.13",
    };
  }

  const initConfig = `
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, '../src/index.tsx'),
  output: {
    filename: 'static/js/[name].js',
    path: path.join(__dirname, '../dist'),
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
  ${
    type === "React"
      ? `
      {
        test: /.(ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript',
            ]
          }
        }
      },
      `
      : ""
  }
      {
        test: /.(css|less)$/,
        use: [
          'style-loader',
          'css-loader',
      ${
        isCompatibleCss3
          ? `
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer']
              }
            }
          },
          `
          : ""
      }
          'less-loader',
        ],
      },
      {
        test:/.(png|jpg|jpeg|gif|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator:{ 
          filename:'static/images/[name][ext]',
        },
      },
      {
        test:/.(woff2?|eot|ttf|otf)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator:{ 
          filename:'static/fonts/[name][ext]',
        },
      },
      {
        test:/.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator:{ 
          filename:'static/media/[name][ext]',
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
    extensions: ['.js', '.tsx', '.ts'],
  },
};
  `;

  pkg.set("devDependencies", newDevDependencies);
  write("build/webpack.base.js", initConfig);
};
