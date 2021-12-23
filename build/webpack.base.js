const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const glob = require("glob");
const isProd = process.env.NODE_ENV === 'production';
const getPageName = (filePath) => {
  const reg = /src\/pages\/([^/]*)/;
  const match = filePath.match(reg);
  return match ? match[1] : null;
};
const entryFiles = glob.sync(
   path.resolve(__dirname, `../src/pages/*/index.{ts,jsx,tsx}`)
);
// 记录入口对象
const entry = {};
// 记录模板插件数组
const htmlWebpackPlugins = [];
entryFiles.forEach((filePath) => {
    const pageName = getPageName(filePath);
    if (!pageName) {
      throw new Error(`未找到${filePath}页面入口文件`);
    }
    entry[pageName] = filePath;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.resolve(
          __dirname,
          `../src/pages/${pageName}/index.html`
        ),
        filename: `${pageName}.html`,
        inject: "body",
        chunks: [pageName],
        minify: {
          // html5:true,
          minifyJS: true,
        },
      })
    );
});
module.exports = {
    entry: entry,
    output: {
        clean: true,
        filename: 'js/[name].[contenthash].js',
        path: path.resolve(__dirname, '../dist'),
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src'),
        },
        extensions: [
          '.ts',
          '.tsx',
          '.js',
          '.jsx',
          '.json',
          '.css',
          '.scss',
          '.less',
      ],
    },
    plugins: [
        ...htmlWebpackPlugins,
        new FriendlyErrorsPlugin(),
        new ESLintPlugin({
          extensions: ['js','ts','tsx'],
          failOnError: false,
        })
    ].filter(Boolean),
    optimization: {
      splitChunks: {
          minSize: 5000,
          cacheGroups: {
              // react技术栈相关的
              reactVendor: {
                  test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
                  name: 'reactVendor',
                  chunks: 'all',
                  priority: 1,
              },
              // node_modules
              defaultVendor: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'defaultVendor',
                  chunks: 'all',
                  // minChunks: 1,
                  priority: 0,
              },
          },
      },
  },
    module: {
        rules: [
            {
            test: /\.css$/i,
            use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'postcss-loader'],
            },
            {
              test: /\.scss$/,
              use: [
              isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader',
                 "postcss-loader"
              ],
          },
          {
            test: /\.(jsx?|tsx?)$/, // 这里为后面改写ts和添加react的jsx做准备
            use: [
                {
                  loader: 'thread-loader',
                  options: {
                      workerParallelJobs: 2, // 使用node-sass会有线程池阻塞线程bug
                  },
              },
                'babel-loader',
            ],
            exclude: /node_modules/,
          },
          // 解析图片资源
          {
              test: /\.(png|svg|jpg|jpeg|gif)$/i,
              type: 'asset',
              parser: {
                  dataUrlCondition: {
                      maxSize: 10 * 1024, // 10kb
                  },
              },
              generator: {
                  filename: 'img/[name][hash][ext][query]',
              },
          },
          // 解析字体资源
          {
              test: /\.(woff|woff2|eot|ttf|otf)$/i,
              type: 'asset/resource',
          },
        ],
    },
    cache: {
        // 1. 将缓存类型设置为文件系统（持久缓存）
        type: "filesystem",
        buildDependencies: {
        // 2. 将你的 config 添加为 buildDependency，以便在改变 config 时获得缓存无效
        // config: [path.join(__dirname, 'webpack.dll_config.js')],
        },
    }
};