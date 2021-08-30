'use strict'
const reqIp = require('request-ip')
const ua = require('useragent')

const mon = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
]

function dt__() {
  const dt = new Date()
  return `${dt.getUTCFullYear()}-${mon[dt.getUTCMonth()]}-${dt.getUTCDate()} ${dt.getUTCHours()}:${dt.getUTCMinutes()}:${dt.getUTCSeconds()}`
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
