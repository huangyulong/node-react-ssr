import React from 'react'
import PropTypes from 'prop-types'

import {
  inject,
  observer,
} from 'mobx-react'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import List, { ListItem, ListItemText } from '@material-ui/core/List'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import UserWrapper from './user'
import infoStyles from './styles/info-styles'

// const TopicItem = (({ topic, onClick }) => (
//   <ListItem button onClick={onClick}>
//     <Avatar src={topic.author.avatar_url} />
//     <ListItemText
//       primary={topic.title}
//       secondary={`最新回复：${topic.last_reply_at}`}
//     />
//   </ListItem>
// ))

/* eslint-disable */
const TopicItem = (({ topic, onClick }) => {
  return (
     <div style={{display: 'flex', alignItems: 'center', cursor:'pointer'}} onClick={onClick}>
         <Avatar src={topic.author.avatar_url} />
       <div style={{ display: 'flex', flexDirection: 'column',}}>
         <p style={{margin: 0}}>{topic.title}</p>
         <p style={{margin: 0, color: '#ccc'}}>最新回复：{topic.last_reply_at}</p>
       </div>
     </div>
  )
})

TopicItem.propTypes = {
  topic: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
}
/* eslint-enable */
@inject(stores => ({
  user: stores.appState.user,
  appState: stores.appState,
})) @observer
class Info extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.goToTopic = this.goToTopic.bind(this)
  }

  componentWillMount() {
    this.props.appState.getUserDetail()
    this.props.appState.getUserCollections()
  }

  goToTopic(id) {
    this.context.router.history.push(`/detail/${id}`)
  }

  render() {
    const { classes } = this.props
    const topics = this.props.user.detail.recentTopics
    const replies = this.props.user.detail.recentReplies
    const collections = this.props.user.collections.list
    return (
      <UserWrapper>
        <div className={classes.root}>
          <Grid container spacing={16} align="stretch">
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>最近发布的话题</span>
                </Typography>
                <List>
                  {
                    topics.length > 0
                      ? topics.map(topic => (
                        <TopicItem topic={topic} onClick={() => this.goToTopic(topic.id)} />
                      ))
                      : <Typography align="center">最近没有发布过话题</Typography>
                  }
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>最近收藏的话题</span>
                </Typography>
                <List>
                  {
                    collections.length > 0
                      ? collections.map(topic => (
                        <TopicItem topic={topic} onClick={() => this.goToTopic(topic.id)} />
                      ))
                      : <Typography align="center">最近没有收藏过话题</Typography>
                  }
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>新的回复</span>
                </Typography>
                <List>
                  {
                    replies.length > 0
                      ? replies.map(topic => (
                        <TopicItem topic={topic} onClick={() => this.goToTopic(topic.id)} />
                      ))
                      : <Typography align="center">最近没有新的回复</Typography>
                  }
                </List>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </UserWrapper>
    )
  }
}

Info.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

Info.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(infoStyles)(Info)
