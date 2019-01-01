const router = require('express').Router()
const axios = require('axios')

const baseUrl = 'https://cnodejs.org/api/v1'

router.post('/login', function(req, res, next) {
  var accessToken = req.body.accessToken
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: accessToken
  })
    .then(resp => {
      if(resp.data.success ) {
        req.session.user = {
          accessToken: req.body.accessToken,
          loginName: resp.data.loginname,
          id: resp.data.id,
          avatarUrl: resp.data.avatar_url
        }

        console.log(req.session.user)
        res.json({
          success: true,
          data: resp.data
        })
      }
    })
    .catch(err => {
      if(err.response) { // 这个response指的是判断是不是业务逻辑有问题  如果是的话就把错误信息返回
        res.json({
          success: false,
          data: err.response.data
        })
      }else{
        next(err)
      }
    })
})

module.exports = router
