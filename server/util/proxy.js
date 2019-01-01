const axios = require('axios')
const queryString = require('query-string')
const baseUrl = 'https://cnodejs.org/api/v1'



module.exports = function( req, res, next) {
  const path = req.path
  const user = req.session.user || {}
  const needAccessToken = req.method === 'GET' ? req.query.needAccessToken : req.body.needAccessToken
  if(needAccessToken && !user.accessToken) {
    res.status(401).send({
      success: false,
      msg: 'need login'
    })
  }

  const query = Object.assign({}, req.query, {
    accesstoken: (needAccessToken && req.method === 'GET') ? user.accessToken : ''
  })

  if(query.needAccessToken) delete query.needAccessToken
  let option = {}
  console.log(req.method)
  if (req.method === 'GET') {
    option = {
      url: `${baseUrl}${path}`,
      method: req.method,
      params: query,
      // 用了queryString后会将原来的json格式转为'key=value'的形式
      data: queryString.stringify(Object.assign({}, req.body, {
        accesstoken: user.accessToken
      })),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  } else {
    option = {
      url: `${baseUrl}${path}`,
      method: req.method,
      // 用了queryString后会将原来的json格式转为'key=value'的形式
      data: queryString.stringify(Object.assign({}, req.body, {
        accesstoken: user.accessToken
      })),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  }
  axios(option)
    .then((resp) => {
      if(resp.success) {
        res.send(resp.data)
      }else{
        res.status(resp.status).send(resp.data)
      }
    }).catch( err => {
    if(err.response) {
      console.log('---error1')
      console.log(err.response.data)
      res.status(500).send(err.response.data)
    }else{
      console.log('---error2222')
      res.status(500).send({
        success: false,
        msg: '未知'
      })
    }
  })

}
