const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


module.exports = {
  devServer: {
    port: 8080,
    host: '127.0.0.1',
    // static: './dist'
  },
  entry: {
    index: './src/index.js',
    print: './src/print.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '管理输出',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    alias: {
        '@': path.resolve(__dirname, './', 'src'),
    },
  },
  devtool: 'eval-source-map',
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