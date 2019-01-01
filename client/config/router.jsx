import React from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import {
  inject,
  observer,
} from 'mobx-react'
import PropTypes from 'prop-types'
import TopicList from '../views/topic-list/index'
import TopicDetail from '../views/topic-detail/index'
import TestApi from '../views/test/api-test'
import Login from '../views/user/login'
import Info from '../views/user/info'
import TopicCreate from '../views/topic-create/index'

const PrivateRoute = ({ isLogin, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={
      props => (
        isLogin
          ? <Component {...props} />
          : <Redirect to={{ pathname: '/user/login', search: `?from=${rest.path}` }} />
      )
    }
  />
)

const InjectPrivateRoute = withRouter(inject(stores => (
  {
    isLogin: stores.appState.user.isLogin,
  }
))(observer(PrivateRoute)))

PrivateRoute.propTypes = {
  isLogin: PropTypes.bool,
  component: PropTypes.element.isRequired,
}

PrivateRoute.defaultProps = {
  isLogin: false,
}

export default () => [
  <Route key="first" path="/" render={() => <Redirect to="/list" />} exact />,
  <Route key="second" path="/list" component={TopicList} />,
  <Route key="third" path="/detail/:id" component={TopicDetail} />,
  <Route key="api" path="/test" component={TestApi} />,
  <Route key="login" path="/login" component={Login} />,
  <Route key="userLogin" path="/user/login" component={Login} />,
  <InjectPrivateRoute key="userInfo" path="/user/info" component={Info} />,
  <InjectPrivateRoute key="topicCreate" path="/topic/create" component={TopicCreate} />,
]
