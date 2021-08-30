'use strict'

module.exports = name => {
  return (req, res, next) => {
    const dt = (new Date()).toISOString()
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
      const msg = `${dt} +${ms} ${req.method} ${url}`
      console.log(msg)
    }
  }
}
