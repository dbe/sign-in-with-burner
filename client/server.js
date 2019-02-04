const express = require('express')
const app = express()
const port = 3001

app.use('/static', express.static('client/static'))

app.get('/', (req, res) => {
  console.log("Serving index.html")
  res.sendFile(`${__dirname}/index.html`)
})

app.listen(port, () => console.log(`Client app listening on port ${port}!`))
