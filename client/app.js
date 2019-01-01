// 应用入口
import React from 'react' // 这一步是必须的 因为jsx翻译出来最终执行的是React.createElement  不然就会包React is not defined
import ReactDOM from 'react-dom'; // react-dom 是将组件渲染到dom中的
import { BrowserRouter } from 'react-router-dom' // BrowserRouter浏览器路由需要包裹上跟组件
import { Provider } from 'mobx-react' // 用来链接视图和数据流
import { AppContainer } from 'react-hot-loader' // eslint-disable-line

// 引入material ui的主题和颜色
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { lightBlue, pink } from '@material-ui/core/colors'
// import 'typeface-roboto'
// 通过这个注释来禁用这一行的检测

import App from './views/App';
import { AppState, TopicStore } from './store/store'

// 创建主题颜色
const theme = createMuiTheme({
  palette: {
    primary: lightBlue, // 主要颜色
    accent: pink, // 次要颜色
    type: 'light', // 整体颜色的颜色浓度
  },
  // typography: {
  //   useNextVariants: true,
  // },
})

/* ReactDOM.render(<App />, document.body); */

const initialState = window.__INITIAL__STATE__ || {} // eslint-disable-line

const createApp = (TheApp) => {
  class Main extends React.Component {
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        // jssStyles.parentNode.removeChild(jssStyles)
      }
    }

    render() {
      return <TheApp />
    }
  }
  return Main
}

const root = document.getElementById('root')

const appState = new AppState()
appState.init(initialState.appState || {})
const topicStore = new TopicStore(initialState.topicStore)

const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider appState={appState} topicStore={topicStore}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Component />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  )
}

render(createApp(App))
/* ReactDOM.hydrate(<App />, document.getElementById('root')); */

/* 判断module中是否有hot模块 如果有  那么每次更新后就从新加载App.jsx 文件 */
if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default // eslint-disable-line
    render(createApp(NextApp))
    /** ReactDOM.hydrate(<nextApp />, document.getElementById('root')); */
  })
}

/**
 * 不推荐这样写  最好有个节点而不是body  这里App要用jsx语法来写 同时webpack要配置上对js的loader
*做服务端渲染的时候  node中是没有document这个对象的，
*ReactDOM.render是用来做本地渲染   hydrate是用来做服务端渲染  防止react出错
 * */
