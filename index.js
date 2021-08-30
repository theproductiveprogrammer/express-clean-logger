'use strict'
const reqIp = require('request-ip')
const ua = require('useragent')
const baby = require('baby-db')

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

  const out = baby(name, {
    loadOnStart: false,
    saveEvery: 100,
    maxRecsEvery: 10000,
    rolloverLimit: 10000,
    parseJSON: false,
  })

  return (req, res, next) => {
    const start = process.hrtime.bigint()
    let logged

    res.on('finish', log_)
    res.on('error', log_)

    next()


    function log_() {
      if(logged) return
      logged = true

      const ms = Math.round(Number(process.hrtime.bigint() - start)/1e6)
      const ua_ = ua.lookup(req.headers['user-agent'])
      const st = st_()
      const msg = `${st.st}${dt} +${ms} ${st.code}${req.method} ${st.url} ${reqIp.getClientIp(req)} ${ua_.family}/${ua_.os.family}/${ua_.device.family}`
      out.add(msg)
    }

    function st_() {
      let url = req.originalUrl || req.url
      if(res.statusCode === 200 || res.statusCode === 304) return { st: " ", code: "", url }
      if(res.statusCode < 300) return { st: " ",  code: `(${res.statusCode}) `, url }
      if(res.statusCode < 400) {
        const loc = res.getHeader('location')
        if(loc) url = `${url} -> ${loc}`
        return { st: ">", code: `(${res.statusCode}) `, url}
      }
      return { st: "!", code: `(${res.statusCode}) `, url }
    }
  }
}
