const express = require('express')
const cors = require('cors')
const app = express()
var bodyParser = require('body-parser')
var redis = require("redis"),
	  log = redis.createClient({host: process.env.GTT_REDIS_HOST, password: process.env.GTT_PASSWORD}),
    pub = redis.createClient({host: process.env.GTT_REDIS_HOST, password: process.env.GTT_PASSWORD}),
    sub = redis.createClient({host: process.env.GTT_REDIS_HOST, password: process.env.GTT_PASSWORD});
const io = require('socket.io')(3001, {path: '/ws'});
io.origins('*:*')
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ pubClient: pub, subClient: sub }));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var corsOptions = {
  origin: 'https://r.gtt.la'
}
app.use(cors(corsOptions))
app.enable('trust proxy');

app.post('/', function (req, res, next) {
  var ip = req.ip
  log.incr(String(req.body.link), function() {})
  log.get(String(req.body.link), function(err, result) {
    io.in(String(req.body.link)).emit('update', {link: String(req.body.link), count: result});
  })
  res.sendStatus(200)
})


io.on('connection', function(socket){
  socket.on('disconnect', function(){});
  socket.on('subscribe', function(room) {
    socket.join(room)
  log.get(room, function(err, result) {
    io.in(room).emit('update', {link: room, count: result});
  })
  })
});
app.listen(3000, () => console.log('Example app listening on port 3000!'))
