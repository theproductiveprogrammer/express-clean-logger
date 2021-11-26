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

module.exports = (name, opts) => {

  const con = name && opts && opts.echo ? msg => console.log(msg) : () => 1
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
    const send = res.send
    let sent
    res.send = content => {
      res.send = send
      res.send(content)
      sent = content
    }

    res.on('finish', log_)
    res.on('error', log_)

    next()


    function log_() {
      if(logged) return
      logged = true

      const ms = Math.round(Number(process.hrtime.bigint() - start)/1e6)
      const ua_ = ua.lookup(req.headers['user-agent'])
      const st = st_()
      const umsg_ = usermsg_()
      const msg = `${st.st}${dt} +${ms} ${st.code}${req.method} ${st.url} ${reqIp.getClientIp(req)} ${ua_.family}/${ua_.os.family}/${ua_.device.family}${umsg_}`
      out.add(msg)
      con(msg)
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

    function usermsg_() {
      if(res.statusCode === 200 || res.statusCode === 304) sent = ""
      if(!sent && !res.cl_msg) return ""
      return m_(res.cl_msg) + m_(sent)
    }

    function m_(s) {
      if(!s) return ""
      if(typeof s === "object") {
        try {
          s = JSON.stringify(s)
        } catch(e) {}
      }
      return " > " + s
    }
  }
}

