import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import UserIcon from '@material-ui/icons/Home'
import {
  inject,
  observer,
} from 'mobx-react'

import Container from '../layout/container'
import userStyles from './styles/user-style'

@inject(stores => ({
  user: stores.appState.user,
})) @observer
class User extends React.Component {
  componentDidMount() {

  }

  render() {
    const { classes } = this.props
    const { isLogin, info } = this.props.user
    return (
      <Container>
        <div className={classes.avatar}>
          <div className={classes.bg}>
            {
              info.avatar_url
                ? <Avatar className={classes.avatarImg} src={info.avatar_url} />
                : <Avatar className={classes.avatarImg}><UserIcon /></Avatar>
            }
            <span className={classes.userName}>{info.loginname || '未登录'}</span>
          </div>
        </div>
        {this.props.children}
      </Container>
    )
  }
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
}

User.wrappedComponent.propTypes = {
  user: PropTypes.object.isRequired,
}

export default withStyles(userStyles)(User)
