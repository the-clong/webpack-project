module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: '3.18.2',
                // 支持chrome 58+ 及 IE 11+
                targets: {
                    chrome: '58',
                    ie: '11',
                },
            },
        ],
        '@babel/preset-react',
        '@babel/preset-typescript',
    ],
    plugins: [
        [
            '@babel/plugin-transform-runtime',
            {
                corejs: 3, // 指定 runtime-corejs 的版本，目前有 2 3 两个版本
            },
        ],
    ],
};
