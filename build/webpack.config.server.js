// 该文件是用来打包server-entry.js  用来做服务端渲染

// 引入path  形成绝对路径 防止相对路径产生的问题
const path = require('path');
const webpack = require('webpack');

const webpackMerge = require('webpack-merge') // 用来合并webpack的配置包

const baseConfig = require('./webpack.base.js')

module.exports = webpackMerge(baseConfig, {
    target: 'node', // webpack 打包出来的内容是使用在哪个执行环境中的  是web  还是node
    mode: 'none',
    //应用的入口
    entry: {
        app: path.join(__dirname, '../client/server-entry.js')
    },
    // externals: Object.keys(require('../package.json').dependencies), // 用來指明打包的時候不把哪些包打進去
    //打包完输出配置
    output: {
        filename: 'server-entry.js', // 就这一个文件 就没必要用hash了
        // 输出的路径
       // path: path.join(__dirname, '../dist'),
        /**静态资源引用时的路径
         *如果不指定的时候  html中script标签的src会是app.hash.js
         *比如加了‘/public’ 那么src中会是 /public/app.hash.js
         *相当于为静态资源的请求加了个前缀，用来区别请求的是静态资源还是后台接口
         *如果是要放到cdn上的话  那么直接将public替换成cdn的地址就好  那么引用的时候就是完整的cdn的路径
         */
       // publicPath: '/public',
        libraryTarget: 'commonjs2', //确定打包出来的js是使用什么规范的 cmd  amd commonjs等
    },
    // jsx 不是标准的js语法  所以webpack是不识别的 所以需要通过配置来让webpack识别
    module: {
        // rules 中可以配置很多loader
        rules: [
            {
              enforce: 'pre', // 在执行真正的编译之前去调用这个loader  如果报错  那么编译就会停止
              test: /.(js|jsx)$/,
              loader: 'eslint-loader',  // 每次编译的时候都要进行eslint规范的检查
              exclude: [  // 检查的时候要避开node_modules文件夹
                path.resolve(__dirname, '../node_modules')
              ]
            },
            {
                test: /.jsx$/, // 配置何种文件可以通过loader来解析
                loader: 'babel-loader', // babel 可以编译各种js语法 编译成浏览器可以执行的es5的语法
                                        // 需要安装babel-loader  然后再安装babel-core作为核心babel代码
                                        // babel默认也不支持jsx语法  需要在根目录下新建文件  .babel.rc
            },
            {
                test: /.js$/,
                loader: 'babel-loader',
                exclude: [ // 编译的过程中排除node_modules文件夹中的js文件
                    path.join(__dirname, '../node_modules')
                ]
            }
        ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.API_BASE': '"http://127.0.0.1:3333"', // 定义的这个变量会在打包后拿到
      })
    ]
})
