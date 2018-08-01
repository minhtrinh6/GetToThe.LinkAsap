var dgram = require('dgram');
// Part of https://github.com/chris-rock/node-crypto-examples
var crypto = require('crypto'),
    algorithm = 'aes-128-cbc',
    password = "PASSWORD";
    
exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const uri = request.uri;

    if (uri == '' || uri == '/index.html' || uri == "/" || uri == "/app.jsx") {
        callback(null, request);
        return;
    }
    
    udp_it(request);
    
    var link = String(uri).replace("/", "").toLowerCase();
    request['uri'] = "/routes/" + link + ".html"
    callback(null, request)
}

function udp_it(request) {
  var HOST = 'l-in.gtt.la'
  var PORT = 48846;

  var message = encrypt(Buffer.from(JSON.stringify(request), "utf8"))
  
  var client = dgram.createSocket('udp4')
  client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
      if (err) throw err;
      client.close();
  });
}

function encrypt(buffer){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
  return crypted;
}