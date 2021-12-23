module.exports = {
    plugins: [
        require('autoprefixer'),
        require('postcss-px-to-viewport')({
            unitToConvert: 'px',
            viewportWidth: 375,
            unitPrecision: 3,
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
            minPixelValue: 1,
            exclude: /(\/|\\)(node_modules)(\/|\\)/
          }),
        ]
  }