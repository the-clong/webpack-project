const defaultUrls = [];
module.exports = {
    mode: 'development',
    // devtool: 'eval-cheap-module-source-map',
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
    },
    devServer: {
        static: '../dist',
        open: true,
        compress: true,
        port: 3000,
        hot: true,
        // 关于proxy的context用法:https://webpack.js.org/configuration/dev-server/#devserverproxy
        proxy: {
            context: defaultUrls.map((iteUrl) => `/${iteUrl}`),
            '/api': {
                target: 'http://localhost:3000',
                pathRewrite: { '^/api': '' },
            },
        }
    },
};
