// 这里放 需要在服务端渲染的内容  然后export出去

import React from 'react'
import { StaticRouter } from 'react-router-dom' // 用来服务端渲染
import { Provider, useStaticRendering } from 'mobx-react'
import { JssProvider } from 'react-jss'
import { MuiThemeProvider } from '@material-ui/core/styles'
import createGenerateClassName from '@material-ui/core/styles/createGenerateClassName'
import App from './views/App';

import { createStoreMap } from './store/store';

useStaticRendering(true) // 让mobx在服务端渲染的时候不会重复数据变换
// routerContext 和 url 是从外面传进来的值
// 在服务端渲染的时候每次都要重新生成store的实例  所以app.js 要改一下
export default (stores, routerContext, sheetsRegistry, jss, theme, url) => {
  jss.options.createGenerateClassName = createGenerateClassName
  return (
    <Provider {...stores}>
      <StaticRouter context={routerContext} location={url}>
        <JssProvider registry={sheetsRegistry} jss={jss}>
          <MuiThemeProvider theme={theme}>
            <App />
          </MuiThemeProvider>
        </JssProvider>
      </StaticRouter>
    </Provider>
  )
}
// 注意这里不是将App直接export出去  而是用jsx语法写

export { createStoreMap }
