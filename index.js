'use strict'
const reqIp = require('request-ip')
const ua = require('useragent')

function p(n) {
  if(n < 10) return "0" + n
  else return n
}

function dt__() {
  const dt = new Date()
  return `${dt.getUTCFullYear()}-${p(dt.getUTCMonth()+1)}-${p(dt.getUTCDate())} ${p(dt.getUTCHours())}:${p(dt.getUTCMinutes())}:${p(dt.getUTCSeconds())}`
}

let dt = dt__()
setInterval(() => dt = dt__(), 500)

module.exports = name => {
  return (req, res, next) => {
    const start = process.hrtime.bigint()
    let logged

    res.on('finish', log_)
    res.on('error', log_)

    next()


    function log_() {
      if(logged) return
      logged = true

      const url = req.originalUrl || req.url
      const ms = Math.round(Number(process.hrtime.bigint() - start)/1e6)
      const ua_ = ua.lookup(req.headers['user-agent'])
      const msg = `${dt} +${ms} ${req.method} ${url} ${reqIp.getClientIp(req)} ${ua_.family}/${ua_.os.family}/${ua_.device.family}`
      console.log(msg)
    }
  }
}
