# A Fast & Useful Request Logger for ExpressJS

This module outputs clean logs that outputs useful information for ExpressJS request/responses.

```javascript
const express = require("express")
const app = express()

const clogger = require('express-clean-logger')
app.use(clogger())

```

Remember to set the logger middleware before any actual processing (including `express.static()`).

You can also log to a file (which will rollover every 10,000 logs)

```javascript
app.use(clogger("/var/logs/myapp.log"))
```

The output contains all the main useful information needed:

```
2021-08-29 22:41:47 +20 GET /url/path 100.172.88.84 Chrome Mobile/Android/Generic Smartphone

---- date/time ---- time ---- url -------- ip ------------------- user agent ---------------
      in UTC     taken in ms

...
 2021-08-30 00:30:59 +3 GET /test/page1 ::1 curl/Other/Other
 2021-08-30 00:31:02 +0 GET /test/page2 ::1 Safari/Mac OS X/Other
 2021-08-30 00:31:12 +0 GET /about/this ::1 Chrome/Windows/Other
 2021-08-30 00:33:20 +4 GET /price/pkg ::1 Mobile Safari/iOS/iPhone

...

(on redirect)
>2021-08-30 12:30:21 +1 (301) GET /aboutme -> /gohere ::1 Chrome/Mac OS X/Other

(on error)
!2021-08-30 12:38:17 +2 (404) GET /gohere ::1 Chrome/Mac OS X/Other > error sent
...

```

## Additional Info

When the response is an error, any error `res.sent()` back to the user will also be added to the log. If you would like to specifically add details to the log set the `res.cl_msg` field on the response and it will be logged out:

```javascript
res.cl_msg = "some details"
```

## Echoing

If you want to echo the output along with writing to the file provide the `{echo: true}` parameter:

```javascript
app.use(clogger("/var/logs/myapp.log", { echo: true }))
```



Enjoy!
