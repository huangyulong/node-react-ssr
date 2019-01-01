//因为开发的过程中 是没有本地的template  所以就会想别的办法去处理
//
//引入axios  在服务开始的时候就请求后台获取这个template
const path = require('path')

const axios = require('axios');


const proxy = require('http-proxy-middleware'); //引入proxy中间件用来管理静态文件


const MemoryFs = require('memory-fs'); //该组件是从内存中读写文件  而不是从硬盘上  这个api跟nodejs 的fs文档是一样的  需要的话可以去看

const webpack = require('webpack'); //开发时启动webpack 获取webpack打包的内容

const serverConfig = require('../../build/webpack.config.server')


const serverRender = require('./server-render')

const getTemplate = () => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:8888/public/server.ejs').then(res => {
          resolve(res.data)
        }).catch(reject)
    })
}

let serverBundle;

const Module = module.constructor

const serverCompiler = webpack(serverConfig); //可以监听entry下依赖的文件的变化

const mfs = new MemoryFs;

serverCompiler.outputFileSystem = mfs; //可以用它来读取bundlePath

//监听entry下依赖的文件的变化
serverCompiler.watch({}, (err, stats) => {
    if(err) throw err;
    //stats 是打包过程中输出的信息
    stats = stats.toJson();//将打包的信息转化为json
    stats.errors.forEach((wrong) => {  //如果有错误信息，依次输出错误信息
        console.error(wrong)
    })
    stats.warnings.forEach((warning) => { //如果有warning信息  那么依次输出warning信息
        console.log(warning)
    })

    const bundlePath = path.join(  //获取服务端的bundle的路径
        serverConfig.output.path,
        serverConfig.output.filename
    )

    const bundle = mfs.readFileSync(bundlePath, 'utf-8') //得到的内容是String类型  并不是在js中使用的模块内容  需改为模块内容  下面三行就是改为了模块输出

    const m = new Module();

    m._compile(bundle, 'server-entry.js ') //用module解析String内容 生成模块,  使用的时候一定要指定模块的名字

    serverBundle = m.exports; //因为我们的server-entry.js是通过exports出来的  所以这里用module也是用exports

    // createStoreMap = m.exports.createStoreMap
})



module.exports = function (app) {
    /**
     * 因为我们是通过dev启动的  所以现在需要将访问的本地静态文件代理到localhost  因为下面我们把全部的请求都返回了相同的html
     * */
    app.use('/public', proxy({
        target: 'http://127.0.0.1:8888'
    }));

    app.get('*', function(req, res, next) {
      if(!serverBundle) {
        return res.send('waiting for compile, refresh later')
      }
        getTemplate().then(template => {
          return serverRender(serverBundle, template, req, res)
          // const routerContext = {}
          // const stores = createStoreMap()
          // const app = serverBundle(stores, routerContext, req.url)
          //
          // bootstrap(app).then(() => {
          //   if(routerContext.url) {
          //     res.status(302).setHeader('Location', routerContext.url)
          //     res.end()
          //     return
          //   }
          //   const state = getStoreState(stores)
          //   const content = ReactDOMServer.renderToString(app)
          //
          //   const helmet = Helmet.rewind()
          //
          //   // res.send(template.replace('<!-- app -->', content))
          //
          //   const html = ejs.render(template, {
          //     appString: content,
          //     initialState: serialize(state),
          //     meta: helmet.meta.toString(),
          //     title: helmet.title.toString(),
          //     // style: helmet.style.toString(),
          //     // link: helmet.link.toString(),
          //   })
          //
          //   res.send(html)
          // })
        }).catch(err => {
          next(err)
        })
    })
}
