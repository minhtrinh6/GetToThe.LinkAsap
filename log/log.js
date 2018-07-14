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
  var PORT = 41234;
  var HOST = "52.201.47.240"

  var message = new Buffer(JSON.stringify(request))
  
  var client = dgram.createSocket('udp4')
  client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
      if (err) throw err;
      console.log('UDP message sent to ' + HOST +':'+ PORT);
      client.close();
  });
}