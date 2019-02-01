const express = require('express')
const app = express()
const port = 3000

app.use('/static', express.static('burner/static'))

app.get('/', (req, res) => {
  console.log("Serving index.html")
  res.sendFile(`${__dirname}/index.html`)
})

app.listen(port, () => console.log(`BurnerWalletServer listening on port: ${port}!`))
