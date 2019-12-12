require('es6-promise').polyfill();

const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './app/app.jsx'
  },
  output: {
    path: path.resolve(__dirname, '../public/compiled'),
    // publicPath: '/',
    filename: '[name].js'
    // filename: '[name].[chunkhash].js',
    // chunkFilename: '[name].[chunkhash].chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // options: options.babelQuery,
        }
        // loader: 'babel-loader',
        // query: {
        //   presets: ['react', 'es2015']
        // }
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react'
    })
  ],
  resolve: {
    extensions: [".webpack.js", ".web.js", ".jsx", ".js"],
    alias: {
      components: path.resolve(__dirname, "../components")
    }
  }
};
