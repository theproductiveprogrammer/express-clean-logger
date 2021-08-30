'use strict'
const express = require('express')
const app = express()

const logger = require('./')

app.use(logger()) // or app.use(logger("log.txt"))

app.get('/', (req, res) => {
  res.send("Hello world!")
})

const port = 3434
app.listen(port, () => console.log(`Started on port: ${port}`))
