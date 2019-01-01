import axios from 'axios'

const baseUrl = process.env.API_BASE || '';

const parseUrl = (url, params) => {
  // const str = Object.keys(params).reduce((result, key) => {
  //   result += `${key}=${params[key]}&`
  //   return result
  // }, '')
  let str = ''
  Object.keys(params).forEach((item) => {
    str += `${item}=${params[item]}&`
  })

  console.log(`${baseUrl}/api/${url}?${str.substr(0, str.length)}`)
  return `${baseUrl}/api/${url}?${str.substr(0, str.length)}`
}

export const get = (url, params) => new Promise((resolve, reject) => {
  const param = params || {}
  axios.get(parseUrl(url, param))
    .then((resp) => {
      const { data } = resp
      if (data && data.success === true) {
        resolve(data)
      } else {
        reject(data)
      }
    }).catch(reject)
})

export const post = (url, datas) => new Promise((resolve, reject) => {
  axios.post(`${baseUrl}/api${url}`, datas)
    .then((resp) => {
      const { data } = resp
      if (data && data.success === true) {
        resolve(data)
      } else {
        reject(data)
      }
    }).catch(reject)
})
