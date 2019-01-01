import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Redirect } from 'react-router-dom'
import queryString from 'query-string'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import loginStyles from './styles/login-style'
import UserWrapper from './user'

@inject(stores => ({
  appState: stores.appState,
  user: stores.appState.user,
})) @observer

class UserLogin extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      helpText: '',
      accesstoken: '',
    }

    this.handleInput = this.handleInput.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {

  }

  getFrom(location) {
    location = location || this.props.location
    const query = queryString.parse(location.search)
    return query.from || '/user/info'
  }

  handleInput(event) {
    this.setState({
      accesstoken: event.target.value.trim(),
    })
  }

  handleClick() {
    if (!this.state.accesstoken) {
      return this.setState({
        helpText: '请输入',
      })
    }
    this.setState({
      helpText: '',
    })
    return this.props.appState.login({ accessToken: this.state.accesstoken })
      .catch((error) => {
        console.log(error) // eslint-disable-line
      })
  }

  render() {
    const { classes } = this.props
    const from = this.getFrom()
    const { isLogin } = this.props.user

    if (isLogin) {
      return <Redirect to={from} />
    }

    return (
      <UserWrapper>
        <div className={classes.root}>
          <TextField
            label="请输入Cnode AccessToken"
            placeholder="请输入Cnode AccessToken"
            required
            helperText={this.state.helpText}
            value={this.state.accesstoken}
            onChange={this.handleInput}
            className={classes.input}
          />
          <Button
            color="primary"
            onClick={this.handleClick}
            className={classes.loginButton}
          >
            登陆
          </Button>
        </div>
      </UserWrapper>
    )
  }
}

UserLogin.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  isLogin: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

UserLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default withStyles(loginStyles)(UserLogin)
