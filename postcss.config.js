const autoprefixer = require('autoprefixer');
const postcssPxToViewport = require('postcss-px-to-viewport');

module.exports = {
    plugins: [
        autoprefixer,
        postcssPxToViewport({
            unitToConvert: 'px',
            viewportWidth: 375,
            unitPrecision: 3,
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
            minPixelValue: 1,
            exclude: /(\/|\\)(node_modules)(\/|\\)/,
        }),
    ],
};
