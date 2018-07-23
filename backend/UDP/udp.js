const dgram = require('dgram'),
	  server = dgram.createSocket('udp4');
const redis = require("redis"),
	  log = redis.createClient({password: 'CuteShibaBouncing'}),
      pub = redis.createClient({password: 'CuteShibaBouncing'}),
      sub = redis.createClient({password: 'CuteShibaBouncing'});
const io = require('socket.io')();
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ pubClient: pub, subClient: sub }));

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
	var req = JSON.parse(msg)
	var uri = String(req.uri.replace('/', '')).toLowerCase()
	log.get(uri, function (err, reply) {
		reply = ((reply != null) ? parseInt(reply,10)+1 : 1)
		io.to(uri).emit('update', {link: uri, count: reply})
		log.incr(uri)
	})
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(48846);
