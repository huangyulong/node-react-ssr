import React from 'react'
import axios from 'axios'

/* eslint-disable */
// 中间这些不用eslint检测
export default class ApiTest extends React.Component {
  getTopic() {
    axios.get('/api/topics')
      .then(res => {
        console.log(res)
      }).catch(err => {
          console.log(err)
      })
  }

  login() {
    axios.post('/api/user/login', {
      accessToken: '3840eb27-975b-4f69-b9d1-e78b0207a3fd'
    })
      .then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
  }

  markAll() {
    axios.post('/api/message/mark_all?needAccessToken=true')
      .then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
  }

  render() {
    return (
      <div>
        <button onClick={this.getTopic}>getTopic</button>
        <button onClick={this.login}>login</button>
        <button onClick={this.markAll}>markAll</button>
      </div>
    )
  }
}
/* eslint-ensable */
