import {
  observable,
  toJS,
  computed,
  action,
  extendObservable,
} from 'mobx'
import { topicSchema, replySchema } from '../util/variable-define'
import { get, post } from '../util/http'

const createTopic = topic => (
  Object.assign({}, topicSchema, topic)
)

const createReply = reply => (
  Object.assign({}, replySchema, reply)
)

// 单独定义topics类
class Topics {
  constructor(data, isDetail) {
    extendObservable(this, data) // 把所有的内容都附加到this上
    this.isDetail = isDetail
  }

  @observable syncing = false // 如果有正在进行的异步调用时 syncing会变为true

  @observable createdReplies = []

  @action doReply(content) {
    return new Promise((resolve, reject) => {
      post(`/topic/${this.id}/replies`, {
        needAccessToken: true,
        content,
      })
        .then((resp) => {
          if (resp.success) {
            this.createdReplies.push(createTopic({
              id: resp.reply_id,
              content,
              create_at: Date.now(),
            }))
            resolve()
          } else {
            reject()
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}


class TopicStore {
  @observable topics

  @observable details
  // 缓存话题列表数据

  @observable syncing

  @observable createTopics = []

  @observable tab

  constructor(
    {
      syncing = false,
      topics = [],
      tab = null,
      details = [],
    } = {},
  ) {
    this.syncing = syncing
    this.details = details.map(topic => new Topics(createTopic(topic)))
    this.topics = topics.map(topic => new Topics(createTopic(topic)))
    // 此时的topics中的数据不一定就是包含了所有字段  所以要自己初始化所有字段
    this.tab = tab
  }

  addTopic(topic) {
    this.topics.push(new Topics(createTopic(topic)))
  }

  @computed get detailMap() {
    const data = this.details.reduce((result, detail) => {
      result[detail.id] = detail
      return result
    }, {})
    return data
  }

  @action fetchTopics(tab) {
    this.topics = []
    return new Promise((resolve, reject) => {
      if (tab === this.tab && this.topics.length > 0) {
        resolve()
      } else {
        this.tab = tab
        this.syncing = true
        this.topics = []
        get('/topics', {
          tab,
          mdrender: false, // 格式转换为markdown 富文本的格式
        }).then((resp) => {
          if (resp.success) {
            this.topics = resp.data.map(item => (
              new Topics(createTopic(item))
            ))
            resolve()
          } else {
            reject()
          }
          this.syncing = false
        }).catch((err) => {
          reject(err)
          this.syncing = false
        })
      }
    })
  }

  @action getTopicDetail(id) {
    return new Promise((resolve, reject) => {
      if (this.detailMap[id]) {
        resolve(this.detailMap[id])
      } else {
        get(`/topic/${id}`, {
          mdrender: false,
        }).then((resp) => {
          if (resp.success) {
            const topic = new Topics(createTopic(resp.data))
            this.details.push(topic)
            resolve(topic)
          } else {
            reject()
          }
        }).catch(reject)
      }
    })
  }

  @action createTopic(title, tab, content) {
    return new Promise((resolve, reject) => {
      post('/topics', {
        needAccessToken: true,
        title,
        tab,
        content,
      })
        .then((resp) => {
          if (resp.success) {
            const topic = {
              title,
              tab,
              content,
              id: resp.topic_id,
              create_at: Date.now(),
            }
            this.createTopics.push(new Topics(createTopic(topic)))
            resolve()
          } else {
            reject()
          }
        })
        .catch(reject)
    })
  }

  toJson() {
    return {
      topics: toJS(this.topics),
      syncing: toJS(this.syncing),
      details: toJS(this.details),
      tab: toJS(this.tab),
    }
  }
}

export default TopicStore
