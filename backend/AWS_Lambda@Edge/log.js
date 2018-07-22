var dgram = require('dgram');

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

  var message = new Buffer.from(JSON.stringify(request))
  
  var client = dgram.createSocket('udp4')
  client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
      if (err) throw err;
      client.close();
  });
}