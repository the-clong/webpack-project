const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
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