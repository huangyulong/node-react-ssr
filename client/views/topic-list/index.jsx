import React from 'react'
import Helmet from 'react-helmet'
import {
  observer,
  inject,
} from 'mobx-react' // inject是用来将store中的数据注入到视图组件中的
import queryString from 'query-string'
import PropTypes from 'prop-types'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import List from '@material-ui/core/List'
import CircularProgress from '@material-ui/core/CircularProgress'
import AppState from '../../store/app-state'
import Container from '../layout/container'
import TopicListItem from './list-item'
import { TopicStore } from '../../store/store';
import { tabs } from '../../util/variable-define'

@inject(stores => ({
  appState: stores.appState,
  topicStore: stores.topicStore,
})) @observer
// 这里的appState是跟app.js中的provider标签中的一致 ，后面的observer是用来同步store中数据的  如果数据变了 那么视图上的数据也变化
class TopicList extends React.Component {
  static contextTypes = { // router在加载时就会加载到contextType中 可以在任何地方通过这种方式获取到
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.changeTab = this.changeTab.bind(this)
    this.listItemClick = this.listItemClick.bind(this)
  }

  componentDidMount() {
    const tab = this.getTab()
    // do it
    this.props.topicStore.fetchTopics(tab)
  }

  componentWillReceiveProps(nextProps) {
    const tab = this.getTab(nextProps.location.search)
    if (nextProps.location.search !== this.props.location.search) {
      this.props.topicStore.fetchTopics(tab)
    }
  }

  getTab(search) {
    search = search || this.props.location.search
    const query = queryString.parse(search);
    return query.tab || 'all'
  }

  // 当在服务端调用asyncBootstrapper的时候会调用本地的这个asyncBootstrap方法 可以在这里做一些操作

  bootstrap() {
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     this.props.appState.count = 3;
    //     resolve(true)
    //   })
    // })
    const query = queryString.parse(this.props.location.search)
    const { tab } = query
    return new Promise((resolve, reject) => {
      this.props.topicStore.fetchTopics(tab || 'all').then(() => true).catch(() => false)
      resolve()
    })
  }

  changeTab(e, value) {
    this.context.router.history.push({
      pathname: '/list',
      search: `?tab=${value}`,
    })
  }

  listItemClick(topic) {
    this.context.router.history.push(`/detail/${topic.id}`)
  }

  render() {
    const { topicStore } = this.props
    const topicList = topicStore.topics
    const syncingTopics = topicStore.syncing
    const tab = this.getTab()
    const { createTopics } = topicStore
    const { user } = this.props.appState
    return (
      <Container>
        <Helmet>
          <title>this is topic list</title>
          <meta name="description" content="this is topic list" />
        </Helmet>
        <Tabs value={tab} onChange={this.changeTab}>
          {
            Object.keys(tabs).map(item => (
              <Tab key={item} value={item} label={tabs[item]} />
            ))
          }
        </Tabs>
        {
          createTopics && createTopics.map((topic) => {
            topic = Object.assign({}, topic, {
              author: user.info,
            })
            return (
              <List style={{ backgroundColor: '#dfdfdf' }}>
                <TopicListItem
                  key={topic.id}
                  onClick={() => this.listItemClick(topic)} // 形成闭包把值传到listItemClick中
                  topic={topic}
                />
              </List>
            )
          })
        }
        <List>
          {
            topicList.map(topic => (
              <TopicListItem
                key={topic.id}
                onClick={() => this.listItemClick(topic)} // 形成闭包把值传到listItemClick中
                topic={topic}
              />))
          }
        </List>
        {
          syncingTopics ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircularProgress color="primary" size={100} />
            </div>
          ) : null
        }
      </Container>
    )
  }
}

TopicList.wrappedComponent.propTypes = {
  appState: PropTypes.instanceOf(AppState).isRequired,
  topicStore: PropTypes.instanceOf(TopicStore).isRequired,
}

TopicList.propTypes = {
  location: PropTypes.object.isRequired,
}


export default TopicList
