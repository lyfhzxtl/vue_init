'use strict'
const baseWebpackConfig = require('./webpack.base.conf');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
module.exports = merge(baseWebpackConfig, {
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      //sass
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?minimize', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new ExtractTextPlugin({
      filename: 'css/[name]_[contenthash:8].css',
      allChunks: true
    }),
    new ParallelUglifyPlugin({
      uglifyEs: {
        compress: {
          // 不输出警告
          warnings: false,
          // 删除所有`console`语句
          drop_console: true,
          // 内嵌已定义但是只用到了一次的变量
          collapse_vars: true,
          // 提取出现多次但没有定义成变量去引用的静态值
          reduce_vars: true
        },
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有注释
          comments: false
        }
      }
    })
  ]
})