const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar'); // build进度条
const path = require('path');


module.exports = {
  devServer: {
    port: 8080,
    host: '127.0.0.1',
    compress: true,
    static: './dist'
  },
  entry: {
    index: {
      import: './src/index.js',
      // dependOn: 'shared',
    },
    print: {
      import: './src/print.js',
      // dependOn: 'shared',
    },
    // shared: 'lodash'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '管理输出',
    }),
    new WebpackBar()
  ],
  output: {
    filename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    alias: {
        '@': path.resolve(__dirname, './', 'src'),
    },
  },
  // devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    chunkIds: process.env.NODE_ENV === 'development' ? "named" : "deterministic"
  },
  cache: {
    // 1. 将缓存类型设置为文件系统（持久缓存）
    type: "filesystem",
    buildDependencies: {
      // 2. 将你的 config 添加为 buildDependency，以便在改变 config 时获得缓存无效
      // config: [__filename],
    },
  }
};