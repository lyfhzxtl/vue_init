'use strict'
const path = require('path');
const webpack = require('webpack');
const HtmlWebapckPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HappyPack = require('happypack');
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
    // 优先采用ES6的代码
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
    // 魔法注释
    // chunkFilename: '[name].js',
    // 输出解析文件的目录，url 相对于 HTML 页面
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
      // eslint
      /* {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          // 不符合Eslint规则时只警告(默认运行出错)
          // emitWarning: !config.dev.showEslintErrorsInOverlay
        }
      }, */
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
      //图片
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240,
            name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
          }
        }]
      },
      // 字体文件
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240,
            name: path.posix.join('static', 'fonts/[name].[hash:7].[ext]')
          }
        }]
      },
      //视频或音频
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240,
            name: path.posix.join('static', 'media/[name].[hash:7].[ext]')
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
      id: 'img',
      loaders: [{
        loader: 'url-loader',
        options: {
          limit: 10240
        }
      }]
    }), */
    // 开启Scope Hoisting
    new ModuleConcatenationPlugin(),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../public'),
      to: './',
      ignore: ['*.html']
    }]),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        // 翻译注释：所有被依赖的模块，如果它在node_modules目录中，都会被抽离出来放进 vendor.js 中
        // 如果模块有一个路径，而且在路径中有 js 文件，并且这个模块是属于 node_modules 中的模块
        // 那这个模块就会被抽离出来，放进名为 vendor 的这个chunk
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    new HtmlWebapckPlugin({
      template: './public/index.html',
      filename: 'index.html',
      hash: true
    }),
  ]
}
