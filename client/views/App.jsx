// 声明整个页面上的内容

import React from 'react'
import Routes from '../config/router'
import MainAppBar from './layout/app-bar'


// export default () => <div><div><p>this is a app fdsfdsffdsfsds</p></div></div>

// Unexpected block statement surrounding arrow body; move the returned
// value immediately after the `=>`  arrow-body-style
// 上面那句话是说明如果函数中只有返回值的话  那么直接写到箭头后面就行 不用加return了
// 如果里面不生命任何的生命周期  那么就可以这样写

export default class App extends React.Component {
  componentDidMount() {
    // lllallal
    // <MainAppBar />
  }

  render() {
    return [
      <MainAppBar key="appBar" />,
      <Routes key="routes" />,
    ]
  }
}
