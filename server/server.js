const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser'); // 将请求发送的数据转化为json格式的
const session = require('express-session')
const favicon = require('serve-favicon')
const path = require('path');
const serverRender = require('./util/server-render')


const app = express();

const isDev = process.env.NODE_ENV === 'development'

app.use(bodyParser.json()) // 将后台返回的数据转化为json格式的数据
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid', // cookie 的 id
  resave: false, // 每次请求是否要申请一个cookieID
  saveUninitialized: false,
  secret: 'react cnode class', // 这个是用来在服务端加密的 字符型值随便设置
}))

// 在渲染之前调用 favicon
app.use(favicon(path.join(__dirname, '../favicon.ico'))) // favicon里面防止ico图标文件

// 在渲染之前调用api
app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))

if(!isDev){
    const template = fs.readFileSync(path.join(__dirname,'../dist/server.ejs'),'utf8');

    // node中用的require（）引入文件  而react中用的import引入
    // require引入的文件会把整个文件引入，而import是会读取里面的default对象
    //所以就会报错Invariant Violation:
    // Objects are not valid as a React child(found: object with keys {__esModule, default}).
    // If you meant to render a collection of children, use an array instead.
    // console.log(require('../dist/server-entry.js'))
    const serverEntry = require('../dist/server-entry.js')

    app.use('/public', express.static(path.join(__dirname, '../dist')))
    //在打包后使用express管理静态文件，如果是开发中需要使用相应的包来管理静态文件

    //服务接收到的所有请求全都返回相同内容
    app.get('*', function (req, res, next){
        // const postData = ReactSSR.renderToString(serverEntry);
        // res.send(template.replace('<!-- app -->',postData))//将模板中的App标签替换为server-entry服务中的内容 这样就会把整个html返回  优化了seo
        serverRender(serverEntry, template, req, res).catch(next)
    });
}else{
    //因为处理的内容比较多  所以就可以单独拿出去一个文件  然后把app传进去就可以对app进行编辑
    const devStatic = require('./util/dev-static');
    devStatic(app)
}

// 该方法用来对错误的抛出进行设置
app.use(function (error, req, res, next) {
  res.status(500).send(error)
})

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3333

app.listen(port, host, function(){
    console.log('node 已启动  监听端口 ' + port)
})
