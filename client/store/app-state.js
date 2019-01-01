import {
  observable,
  // computed,
  // autorun,
  toJS,
  action,
} from 'mobx'
import { post, get } from '../util/http'

export default class AppState {
  @observable user = {
    isLogin: false,
    info: {},
    detail: {
      recentTopics: [],
      recentReplies: [],
      syncing: false,
    },
    collections: {
      syncing: false,
      list: [],
    },
  }

  init({ user }) {
    if (user) {
      console.log(user)
      this.user = user
    }
  }

  @action login(accessToken) {
    return new Promise((resolve, reject) => {
      post('/user/login', accessToken).then((resp) => {
        if (resp.success) {
          this.user.isLogin = true
          this.user.info = resp.data
          resolve()
        } else {
          reject(resp)
        }
      })
    })
  }

  @action getUserDetail() {
    this.user.detail.syncing = true
    return new Promise((resolve, reject) => {
      get(`/user/${this.user.info.loginname}`)
        .then((resp) => {
          if (resp.success) {
            this.user.detail.recentTopics = resp.data.recent_topics
            this.user.detail.recentReplies = resp.data.recent_replies
            resolve()
          } else {
            reject()
          }
          this.user.detail.syncing = false
        })
        .catch((err) => {
          this.user.detail.syncing = false
          reject(err)
        })
    })
  }

  @action getUserCollections() {
    this.user.collections.syncing = true
    return new Promise((resolve, reject) => {
      get(`/topic_collect/${this.user.info.loginname}`)
        .then((resp) => {
          if (resp.success) {
            this.user.collections.list = resp.data
            resolve()
          } else {
            reject()
          }
          this.user.collections.syncing = false
        })
        .catch((err) => {
          this.user.collections.syncing = false
          reject(err)
        })
    })
  }

  toJson() {
    return {
      user: toJS(this.user),
    }
  }

  /*
  以前测试用的
  constructor({ count, name } = { count: 0, name: 'jock' }) {
    this.count = count;
    this.name = name;
  }

  @observable count // 加上@observable 定义的变量可以在修改后同步到视图中

  @observable name

  @computed get msg() {
    return `${this.name} say count is ${this.count}`
  }

  @action add() {
    this.count += 1
  }

  @action changeName(value) {
    this.name = value
  }

  // 该方法是用来将appState中的东西以json的形式输出 方便我们拿到
  toJson() {
    return {
      count: this.count,
      name: this.name,
    }
  }
  */
}

// const appState = new AppState()

// setInterval(() => {
//   appState.add()
// }, 1000)
//
// autorun(() => {
//   // 这个方法相当于监听AppState  如果其变化  那么就会监听到并调用这个方法
//   // console.log(appState.msg)
// })

// export default appState
