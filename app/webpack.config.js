require('es6-promise').polyfill();

const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './app/app.jsx'
  },
  output: {
    filename: 'public/app-compiled.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react'
    })
  ],
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".jsx", ".js"],
    alias: {
      components: path.resolve(__dirname, "../components")
    }
  }
};
