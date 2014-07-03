var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()
var router = express.Router()
var port = process.env.PORT || 8080

mongoose.connect('mongodb://localhost:27017/goodtunes')

app.use(bodyParser.urlencoded({
    extended: true
}))

require('./routes/users')(router)
require('./routes/playlists')(router)
require('./routes/tracks')(router)

router.get('/', function(req, res) {
    res.json({
        message: 'this is the good tunes API'
    })
})

app.use('/api/v1', router)

app.listen(port)