
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');

const devConfig = {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    hot: true,
    inline: true,
    open: true,
    stats: 'errors-only',
  },
  devtool: 'source-map',
};
module.exports = merge(baseConfig, devConfig);
