
const path = require('path');
const glob = require('glob');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const projectRoot = process.cwd();
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));
  entryFiles.forEach((item) => {
    const regResult = item.match(/src\/(.*)?\/index\.js$/);
    const pageName = regResult && regResult[1];
    entry[pageName] = item;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(projectRoot, `./src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: ['common', pageName],
        inject: true,
        minify: {
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        },
      })
    );
  });
  return {
    entry,
    htmlWebpackPlugins,
  };
};
const { entry, htmlWebpackPlugins } = setMPA();
const cssloader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [
        autoprefixer({
          overrideBrowserslist: ['last 2 version', '>1%', 'ios 7'],
        }),
      ],
    },
  },
  {
    loader: 'px2rem-loader',
    options: {
      remUni: 75,
      remPrecision: 8,
    },
  },
];

module.exports = {
  entry,
  output: {
    path: path.join(projectRoot, './dist'),
    filename: 'static/js/[name]_[hash:8].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader',
          //  {
          //     loader: 'eslint-loader',
          //     options: {
          //         fix: true,
          //     },
          // }
        ],
        exclude: '/node_modules/',
      },
      {
        test: /\.css$/,
        use: [
          ...cssloader,
        ],
      },
      {
        test: /\.less$/,
        use: [
          ...cssloader,
          'less-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          ...cssloader,
          'resolve-url-loader',
          'sass-loader?sourceMap=true',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/images/[name].[hash:8].[ext]',
          },
        }],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'static/fonts/[name].[hash:8].[ext]',
          },
        }],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(), // 命令行信息显示优化
    function errorPlugin() { // 错误捕获和处理
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          process.exit(1);
        }
      });
    },
    new MiniCssExtractPlugin({
      filename: 'static/css/[name]_[contenthash:8].css',
    }),
    ...htmlWebpackPlugins,
  ],
  stats: 'errors-only',
};
