# A Useful Request Logger for ExpressJS

This module outputs clean logs that outputs useful information for ExpressJS request/responses.

```javascript
const express = require("express")
const app = express()

const clogger = require('express-clean-logger')
app.use(clogger())

```

You can also log to a file (which will rollover ever 10,000 logs)

```javascript
app.use(clogger("/var/logs/myapp.log"))
```

The output contains all the main useful information needed:

```
2021-08-29 22:41:47 +20 GET /url/path 100.172.88.84 Chrome Mobile/Android/Generic Smartphone

---- date/time ---- time ---- url -------- ip ------------------- user agent ---------------
      in UTC     taken in ms
```
