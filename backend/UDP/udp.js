const dgram = require('dgram'),
	  server = dgram.createSocket('udp4');
const redis = require("redis"),
	  log = redis.createClient({host: process.env.GTT_REDIS_HOST, password: process.env.GTT_PASSWORD}),
    pub = redis.createClient({host: process.env.GTT_REDIS_HOST, password: process.env.GTT_PASSWORD}),
    sub = redis.createClient({host: process.env.GTT_REDIS_HOST, password: process.env.GTT_PASSWORD});
const io = require('socket.io')();
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ pubClient: pub, subClient: sub }));
// Part of https://github.com/chris-rock/node-crypto-examples
var crypto = require('crypto'),
    algorithm = 'aes-128-cbc',
    password = process.env.GTT_PASSWORD;
var useragent = require('useragent');
// useragent(true);


server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
	var msg = JSON.parse(decrypt(msg).toString('utf-8'));
	var req = msg.cf.request;
	process_request(msg);
	var uri = String(req.uri.replace('/', '')).toLowerCase()
	log.hget(uri, "count", function (err, reply) {
		reply = ((reply != null) ? parseInt(reply,10)+1 : 1)
		io.to(uri).emit('update', {link: uri, count: reply})
		log.hincrby(uri, "count", 1)
	})
});

function decrypt(buffer){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = Buffer.concat([decipher.update(buffer) , decipher.final()]);
  return dec;
}

function process_request(msg) {
  var req = msg.cf.request;
  var uri = String(req.uri.replace('/', '')).toLowerCase()
  var ua = typeof req['headers']['user-agent'] != 'undefined' ? useragent.parse(req['headers']['user-agent'][0]['value']) : undefined
  var ref = typeof req['headers']['referer'] != 'undefined' ? req['headers']['referer'][0]['value'] : undefined
  
  if (ua != undefined) {
    console.log(ua.family)
    log.hincrby(uri+":browsers", ua.family, 1)
    log.hgetall(uri+":browsers", function(err, result) {
      io.to(uri+"-stat").emit("update-stat", result)
      console.log('emit', uri)
    })
    
  }
  // console.log(ua), ref)
  return true;
}

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(48846);
