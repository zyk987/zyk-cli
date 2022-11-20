import { write } from "utils/file";

export default () => {
  const initConfig = `
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
module.exports = merge(baseConfig, {
  mode: 'production',
});
  `;

  write("build/webpack.prod.js", initConfig);
};
