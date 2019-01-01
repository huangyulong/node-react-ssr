
const path = require('path')

module.exports = {
  output: {
    path: path.join(__dirname, '../dist'),
    /**静态资源引用时的路径
     *如果不指定的时候  html中script标签的src会是app.hash.js
     *比如加了‘/public’ 那么src中会是 /public/app.hash.js
     *相当于为静态资源的请求加了个前缀，用来区别请求的是静态资源还是后台接口
     *如果是要放到cdn上的话  那么直接将public替换成cdn的地址就好  那么引用的时候就是完整的cdn的路径
     */
    publicPath: '/public',
  },
  resolve: {
    extensions: [ '.js', '.jsx'] // 用来指定哪种类型的文件不用写后缀
  },
  module: {
    //rules 中可以配置很多loader
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
}
