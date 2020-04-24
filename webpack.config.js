const path = require('path')

module.exports = {
  optimization: {
    minimize: false
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules')],
    alias: {
      '@': path.resolve('cypress')
    },
    extensions: ['.json', '.js', '.css']
  },
  node: {
    __dirname: true
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-modules-commonjs']
        }
      }
    ]
  }
}
