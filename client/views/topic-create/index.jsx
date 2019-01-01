import React from 'react'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'

import axios from 'axios'
import TextField from '@material-ui/core/TextField'
import Radio from '@material-ui/core/Radio'
import Button from '@material-ui/core/Button'
import IconReply from '@material-ui/icons/Reply'
import SnackBar from '@material-ui/core/Snackbar'
import { withStyles } from '@material-ui/core/styles'

// import SimpleMDE from 'react-simplemde-editor'
import SimpleMDE from '../../components/simple-mde/index'
import Container from '../layout/container'
import createStyles from './styles'
import { tabs } from '../../util/variable-define'


@inject(stores => (
  {
    topicStore: stores.topicStore,
    // appState: stores.appState,
  }
)) @observer
class TopicCreate extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      // showEditor: false,
      title: '',
      content: '',
      tab: 'dev',
      messages: '',
      open: false,
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleChangeTab = this.handleChangeTab.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  // componentDidMount() {
  //   setTimeout(() => {
  //     this.setState({
  //       showEditor: true,
  //     })
  //   }, 500)
  // }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value.trim(),
    })
  }

  handleContentChange(value) {
    this.setState({
      content: value,
    })
  }

  handleChangeTab(e) {
    this.setState({
      tab: e.currentTarget.value,
    })
  }

  handleClose() {
    this.setState({
      open: false,
    })
  }

  showMessage(message) {
    this.setState({
      open: true,
      messages: message,
    })
  }

  handleCreate() {
    // do create here
    const {
      tab, title, content,
    } = this.state
    // const { appState } = this.props
    if (!title) {
      this.showMessage('标题必须填写')
      return
      // return appState.notify({
      //   message: '标题必须填写',
      // })
    }
    if (!content) {
      this.showMessage('内容不能为空')
      return
      // return appState.notify({
      //   message: '内容不能为空',
      // })
    }
    // console.log(555555555555)
    // axios.post('https://cnodejs.org/api/v1/topics',
    //   { title, tab, content, accesstoken: ' 5ab1fe69-ea0f-4bad-b624-9abfa44a4113' })
    //   .then(() => { console.log(3333333) })
    this.props.topicStore.createTopic(title, tab, content)
      .then(() => {
        console.log('---createTopic success go to list')
        this.context.router.history.push('/list')
      })
      .catch((err) => {
        this.showMessage(err.message)
        // appState.notify({
        //   message: err.message,
        // })
      })
  }

  render() {
    const { classes } = this.props
    const { messages, open } = this.state
    return (
      <Container>
        <SnackBar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          message={messages}
          open={open}
          onClose={this.handleClose}
        />
        <div className={classes.root}>
          <TextField
            className={classes.title}
            label="标题"
            value={this.state.title}
            onChange={this.handleTitleChange}
            fullWidth
          />
          <SimpleMDE
            onChange={this.handleContentChange}
            value={this.state.newReply}
            options={{
              toolbar: false,
              spellChecker: false,
              placeholder: '发表你的精彩意见',
            }}
          />
          <div>
            {
              Object.keys(tabs).map((tab) => {
                if (tab !== 'all' && tab !== 'good') {
                  return (
                    <span className={classes.selectItem} key={tab}>
                      <Radio
                        value={tab}
                        checked={tab === this.state.tab}
                        onChange={this.handleChangeTab}
                      />
                      {tabs[tab]}
                    </span>
                  )
                }
                return null
              })
            }
          </div>
          <Button fab="true" color="primary" onClick={this.handleCreate} className={classes.replyButton}>
            <IconReply />
          </Button>
        </div>
      </Container>
    )
  }
}

TopicCreate.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
  // appState: PropTypes.object.isRequired,
}

TopicCreate.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(createStyles)(TopicCreate)
