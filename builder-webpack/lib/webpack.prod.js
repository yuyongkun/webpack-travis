const merge = require('webpack-merge');
const cssnano = require('cssnano');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin();
const baseConfig = require('./webpack.base');

const analyzerFlag = process.argv.includes('--analyzer=true');
const smpFlag = process.argv.includes('--smp=true');
const plugin = [
  new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/g,
    cssProcessor: cssnano,
  }),
  new HtmlWebpackExternalsPlugin({// 分离基础库
    externals: [
      {
        module: 'react',
        entry: 'https://unpkg.com/react@16/umd/react.development.js',
        global: 'React',
      },
      {
        module: 'react-dom',
        entry: 'https://unpkg.com/react-dom@16/umd/react-dom.development.js',
        global: 'ReactDOM',
      },
    ],
  }),
];
if (analyzerFlag) {
  plugin.push(new BundleAnalyzerPlugin({
    analyzerPort: 3000,
  }));
}
const prodConfig = {
  mode: 'production',
  plugins: [
    ...plugin,
  ],
  optimization: {
    splitChunks: {// 提取公共资源
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'common',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
};
if (smpFlag) {
  module.exports = smp.wrap(merge(baseConfig, prodConfig));
} else {
  module.exports = merge(baseConfig, prodConfig);
}
