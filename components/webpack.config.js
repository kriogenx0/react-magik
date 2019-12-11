require('es6-promise').polyfill();

const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'index.js')
  },
  output: {
    filename: 'compiled/components.js',
    library: 'volta',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    }
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }, {
        test: /\.json$/,
        loader: "json"
      }
    ]
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".jsx", ".js"],
    alias: {
      lib: path.join(__dirname, "/lib")
    }
  }
};
