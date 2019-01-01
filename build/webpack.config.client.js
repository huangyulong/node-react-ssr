//配置webpack的内容  

//引入path  形成绝对路径 防止相对路径产生的问题
const path = require('path');

const webpack = require('webpack')

const webpackMerge = require('webpack-merge') // 用来合并webpack的配置包

const baseConfig = require('./webpack.base.js')

const HTMLPlugin = require('html-webpack-plugin');

const NameAllModulesPlugin = require('name-all-modules-plugin')

//下面要配置在开发过程中使用到的插件  所以就要判断是开发时还是线上环境
const isDev = process.env.NODE_ENV === 'development'   //这个development是我们启动webpack时自己确定的



const config = webpackMerge(baseConfig, { // 合并webpack配置文件 后面的会覆盖前面的
    mode: 'none',
    //应用的入口 
    entry: { 
        app: path.join(__dirname, '../client/app.js')
    },
    //打包完输出配置
    output: {
        //指定文件输出的名字 其中[]代表变量 name 代表entry下的名字例如app 
        //[hash] hash值 只要文件中的内容改变  那么hash值也会变化  可以让浏览器重新缓存文件
        filename: '[name].[hash].js', 
        //输出的路径
       // path: path.join(__dirname, '../dist'),
        /**静态资源引用时的路径
        *如果不指定的时候  html中script标签的src会是app.hash.js 
        *比如加了‘/public’ 那么src中会是 /public/app.hash.js
        *相当于为静态资源的请求加了个前缀，用来区别请求的是静态资源还是后台接口
        *如果是要放到cdn上的话  那么直接将public替换成cdn的地址就好  那么引用的时候就是完整的cdn的路径
        */
       // publicPath: '/public/' //public后面的斜杠不能少
    },
    //jsx 不是标准的js语法  所以webpack是不识别的 所以需要通过配置来让webpack识别
    plugins: [
        new HTMLPlugin({
            template: path.join(__dirname, '../client/template.html')
        }), //配置生成相应的html入口页面，同时将entry中的文件注入进去，路径和名字为output里配置的
        new HTMLPlugin({
          template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
          filename: 'server.ejs'
        })
    ]
})

if(isDev){
    config.devtool = '#cheap-module-eval-source-map' // 在浏览器端打开的调试页面的时候实际上是调试的源代码而不是打包编译好的代码
    //在devServer中进行开发环境的常用配置
    //为了使用客户端热更新需要重新配置entry
    config.entry = {
        app: [
            'react-hot-loader/patch',
            path.join(__dirname, '../client/app.js')
        ]
    }
    config.devServer = {
        host: '0.0.0.0', //启动devServer 0.0.0.0 是可以通过任何方式访问 比如127.0.0.1  或者localhost
        port: '8888',
        // contentBase:  path.join(__dirname, '../dist'), //启动webpack就是为了访问编译过的文件  所以contentbase指向打包的文件夹
        hot: true, //启动hot module replacement
        overlay: {  //用来如果打包编译过程中出现了问题  那么就在浏览器中显示出来错误信息
            errors: true
        },
        //下面两个命令的含义是所有访问的路径都要加public 并且如果请求过程中出错误  那么就会跳到historyApiFallback指定的html中
        //而且如果本地有dist文件夹的话 那么webpack就会去本地找dist文件  所以最好就是删掉本地的dist
        publicPath: '/public',
        historyApiFallback:{
            index: '/public/index.html'
        },
        proxy: {
          '/api': 'http://localhost:3333'
        }
    }
    config.plugins.push( new webpack.HotModuleReplacementPlugin())

} else {
  config.entry = {
    app: path.join(__dirname, '../client/app.js'),
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'mobx',
      'mobx-react',
      'axios',
      'query-string',
      'dateformat',
      'marked',
    ]
  }
  config.optimization = {
    minimize: true, // 压缩js代码
    runtimeChunk: {
      name: 'manifest'
    }, // webpack 运行的包 打包在一起
    splitChunks: {
      chunks: 'async',
      minSize: 100,
      minChunks: 1,
      cacheGroups: {
        vendor: { // 用来将app中引用到的包不再进行打包到app里 而是打包到vendor里
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'async',
        }
      },
    },
    namedModules: true,
    namedChunks: true,
  }
  config.output.filename = '[name].[chunkhash].js' // 如果有多个entry的时候可以使用chunkhash 给每个文件一个hash码
  config.plugins.push(
    new NameAllModulesPlugin(), // 防止optimization的nameModules不好用
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),

  //   // new webpack.optimization.minimize(),
  //   new webpack.optimize.CommonsChunkPlugin({
  //     name: 'vendor'
  //   }),
  //   //由于webpack会自己生成一些东西，而且每次打包生成的都不一样 而这些都会打包到vendor中 会让vendor的hash变化 所以
  //   new webpack.optimize.CommonsChunkPlugin({
  //     name: 'manifest', // 将除了上面定义的app vendor之外的包打包到这里
  //     minChunks: Infinity, // 无限压缩包
  //   })
  )
}

module.exports = config
