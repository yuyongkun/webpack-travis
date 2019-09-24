const path = require('path');
const glob = require('glob');
const merge = require('webpack-merge');
const cssnano = require('cssnano');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseConfig = require('./webpack.base');

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index-server.js'));
  entryFiles.forEach((item) => {
    const regResult = item.match(/src\/(.*)?\/index-server\.js$/);
    const pageName = regResult && regResult[1];
    entry[pageName] = item;
    if (pageName) {
      htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          template: path.join(__dirname, `./src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: ['common', pageName],
          inject: true,
          minify: {
            collapseWhitespace: false,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false,
          },
        }),
      );
    }
  });
  return {
    entry,
    htmlWebpackPlugins,
  };
};
const { entry, htmlWebpackPlugins } = setMPA();
const prodConfig = {
  entry,
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'static/js/[name]-server.js',
    libraryTarget: 'umd',
    publicPath: '/',
  },
  mode: 'none',

  // module: {
  //   rules: [
  //     {
  //       test: /\.css$/,
  //       use: 'ignore-loader',
  //     },
  //     {
  //       test: /\.less$/,
  //       use: 'ignore-loader',
  //     },
  //     {
  //       test: /\.scss$/,
  //       use: 'ignore-loader',
  //     },
  //   ],
  // },
  plugins: [
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
          global: 'ReactDom',
        },
      ],
    }),
    ...htmlWebpackPlugins,
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
baseConfig.plugins = baseConfig.plugins.slice(0, baseConfig.plugins.length - 2)
console.log(merge(baseConfig, prodConfig).plugins[6]);

module.exports = merge(baseConfig, prodConfig);
