const express = require('express')
const app = express()

app.use('/girls', express.static('pics/pic/girls'));
app.use('/boy', express.static('pics/pic/boy'));

app.get('/', function (req, res) {
  res.send('Stop F*** Around')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
