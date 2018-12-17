'use strict'
const baseWebpackConfig = require('./webpack.base.conf');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const path = require('path');
module.exports = merge(baseWebpackConfig, {
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      //sass
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  devServer: {
    port: 8008,
    contentBase: path.join(__dirname, '../dist'),
    proxy: {
      '/cross/*': {
        target: 'https://static.missevan.com',
        changeOrigin: true,
        pathRewrite: {
          '^/cross': '/'
        },
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new ExtractTextPlugin({
      filename: 'css/[name]_[contenthash:8].css',
      allChunks: true
    }),
    new FriendlyErrorsPlugin()
  ]
})