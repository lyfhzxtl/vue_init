'use strict'
const path = require('path');
const webpack = require('webpack')
const HtmlWebapckPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HappyPack = require('happypack');
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.js',
      '@': resolve('src')
    },
    extensions: ['.js', '.vue'],
    mainFields: ['jsnext: main', 'browser', 'main']
  },
  //解析入口起点
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    // 所有文件的输出目录
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    // 指定存放js文件的CDN目录URL
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/'
  },
  module: {
    rules: [
      //vue
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      //es6
      {
        test: /\.js$/,
        use: 'happypack/loader?id=babel',
        include: [resolve('src'), resolve('test')]
      },
      //jsx
      /* {
      test: /\.jsx$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react']
        }
      }]
      }, */
      //less
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      //css
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // 字体文件
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240
          }
        }]
      },
      //图片
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240
            //如果被打包的图片大于该字节，则发送http请求获取；如果小于该字节量，则直接被硬编码成base64内嵌在html网页中
          }
        }]
      },
      //视频或音频
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240
          }
        }]
      }
      // ts，需要在webpack.config.js同级目录下创建一个tsconfig.json文件，里面可以是一个空对象
      /* {
        test: /\.ts$/,
        use: ['ts-loader']
      } */
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebapckPlugin({
      template: './public/index.html',
      filename: 'index.html',
      hash: true
    }),
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../')
    }),
    new HappyPack({
      // 用唯一的标识符id来代表当前的HappyPack 处理一类特定的文件
      id: 'babel',
      // 如何处理.js文件，用法和Loader配置是一样的
      loaders: ['babel-loader']
    }),
    /* new HappyPack({
      id: 'vue',
      loaders: ['vue-loader']
    }), */
    // 开启Scope Hoisting
    new ModuleConcatenationPlugin(),
    new VueLoaderPlugin()
  ]
}