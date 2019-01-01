import React from 'react'
import PropTypes from 'prop-types'
import marked from 'marked'
import Helmet from 'react-helmet'
import {
  inject,
  observer,
} from 'mobx-react'

// import SimpleMDE from 'react-simplemde-editor'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import SimpleMDE from '../../components/simple-mde/index'
import Container from '../layout/container'
import { topicDetailStyles } from './styles'
import Reply from './reply'

@inject(stores => ({
  topicStore: stores.topicStore,
  user: stores.appState.user,
})) @observer
class TopicDetail extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      newReply: '',
    }
    this.handleNewReply = this.handleNewReply.bind(this)
    this.goToLogin = this.goToLogin.bind(this)
    this.doReply = this.doReply.bind(this)
  }

  componentDidMount() {
    const { id } = this.props.match.params
    this.props.topicStore.getTopicDetail(id)
  }

  handleNewReply(value) {
    this.setState({
      newReply: value,
    })
  }

  goToLogin() {
    this.context.router.history.push('/user/login')
  }

  doReply() {
    const { id } = this.props.match.params
    const topic = this.props.topicStore.detailMap[id]
    console.log(topic)
    topic.doReply(this.state.newReply)
      .then(() => {
        this.setState({
          newReply: '',
        })
      })
      .catch((err) => {
        console.log(err) // eslint-disable-line
      })
  }

  render() {
    const { classes, user } = this.props
    const { id } = this.props.match.params
    const topic = this.props.topicStore.detailMap[id]

    if (!topic) {
      return (
        <Container>
          <section className={classes.loadingContainer}>
            <CircularProgress color="primary" />
          </section>
        </Container>
      )
    }
    return (
      <div>
        <Container>
          <Helmet>
            <title>{topic.title}</title>
          </Helmet>
          <header className={classes.header}>
            <h3>{topic.title}</h3>
          </header>
          <section className={classes.body}>
            <p dangerouslySetInnerHTML={{ __html: marked(topic.content) }} />
          </section>
        </Container>

        {
          topic.createdReplies && topic.createdReplies.length > 0
            ? (
              <Paper elevation={4} className={classes.replies}>
                <header className={classes.replyHeader}>
                  <span>我的最新回复</span>
                  <span>{`${topic.createdReplies.length}条`}</span>
                </header>
                {
                  topic.createdReplies.map(reply => (
                    <Reply
                      key={reply.id}
                      reply={Object.assign({}, reply, {
                        author: {
                          loginname: user.info.loginname,
                          avatar_url: user.info.avatar_url,
                        },
                      })}
                    />
                  ))
                }
              </Paper>
            )
            : null
        }

        <Paper elevation={4} className={classes.replies}>
          <header className={classes.replyHeader}>
            <span>{`${topic.reply_count} 回复`}</span>
            <span>{`最新回复 ${topic.last_reply_at}`}</span>
          </header>
          {
            user.isLogin
              ? (
                <section className={classes.replyEditor}>
                  <SimpleMDE
                    value={this.state.newReply}
                    onChange={this.handleNewReply}
                    options={{
                      toolbar: false,
                      autoFocus: false,
                      spellChecker: false,
                      placeholder: '添加精彩回复',
                    }}
                  />
                  <Button
                    fab
                    color="primary"
                    onClick={this.doReply}
                    className={classes.replyButton}
                  >
                    回复
                  </Button>
                </section>
              )
              : (
                <section className={classes.notLoginButton}>
                  <Button color="default" onClick={this.goToLogin}>点击登陆</Button>
                </section>
              )
          }
          <section>
            {
              topic.replies.map(reply => <Reply reply={reply} key={reply.id} />)
            }
          </section>
        </Paper>
      </div>
    )
  }
}

TopicDetail.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

TopicDetail.propTypes = {
  match: PropTypes.object.isRequired, // 路由对象中的传的参数
  classes: PropTypes.object.isRequired,
}

export default withStyles(topicDetailStyles)(TopicDetail)
