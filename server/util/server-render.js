// 这个是用来将开发模式和线上模式整合起来  公用代码
const serialize = require('serialize-javascript') // 用来序列化JavaScript对象的
const ejs = require('ejs')
const Helmet = require('react-helmet').default

const SheetsRegistry = require('react-jss').SheetsRegistry
// const SheetsRegistry = require('jss').SheetsRegistry
const create = require('jss').create
const preset = require('jss-preset-default').default
const createMuiTheme = require('@material-ui/core/styles').createMuiTheme
const createGenerateClassName = require('@material-ui/core/styles').createGenerateClassName
const jssPreset = require('@material-ui/core/styles').jssPreset

const colors = require('@material-ui/core/colors')

const bootstrap = require('react-async-bootstrapper'); // 该包是通过export导出来的  所以要用default使用  该包也是用来做动态数据的渲染的
const ReactDOMServer = require('react-dom/server')

const getStoreState = (stores) => {
  // return Object.keys(stores).reduce((result, storeName) => {
  //   result[storeName] = stores[storeName].toJson()
  //   return result
  // }, {})
  let result = {}
  Object.keys(stores).forEach((item) => {
    result[item] = stores[item].toJson()
  })
  return result
}


module.exports = (buddle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const user = req.session.user
    const createStoreMap = buddle.createStoreMap
    const createApp = buddle.default
    const routerContext = {}
    const stores = createStoreMap()
    const sheetsRegistry = new SheetsRegistry()
    console.log(stores)
    const jss = create({
      ...jssPreset(),
      insertionPoint: 'jss-insertion-point'
    })

    jss.options.createGenerateClassName = createGenerateClassName
    if (user) {
      stores.appState.user.isLogin = true
      stores.appState.user.info = user
    }
    const theme = createMuiTheme({
      palette: {
        primary: colors.lightBlue,
        accent: colors.pink,
        type: 'light',
      },
    })
    const app = createApp(stores, routerContext, sheetsRegistry, jss, theme, req.url)
    bootstrap(app).then(() => {

      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
        return
      }
      const state = getStoreState(stores)
      const content = ReactDOMServer.renderToString(app)
      const helmet = Helmet.rewind()

      // res.send(template.replace('<!-- app -->', content))

      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        materialCss: sheetsRegistry.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
      })

      res.send(html)
      resolve()
    }).catch(reject)
  })
}
