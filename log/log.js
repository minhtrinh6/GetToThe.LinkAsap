const AWS = require('aws-sdk');
var lambda = new AWS.Lambda({region: 'us-east-1'});
const iotData = new AWS.IotData({endpoint: 'a3g47r8brmmqer.iot.us-east-1.amazonaws.com'});
var Redis = require('redis');
var client = Redis.createClient({host: '52.201.47.240', password: 'CuteShibaBouncing'})

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const uri = request.uri;
    
    if (uri == '' || uri == '/index.html' || uri == "/" || uri == "/app.jsx") {
        callback(null, request);
        return;
    }
  
    lambda.invoke({
      FunctionName: 'gttlalog-dev-logging',
      Payload: JSON.stringify(event, null, 2),
      InvocationType: 'Event'
    })
    
    request['uri'] = "/routes/" + link + ".html"
    callback(null, request)
}

lambda.invoke({
  FunctionName: 'name_of_your_lambda_function',
  Payload: JSON.stringify(event, null, 2) // pass params
}, function(error, data) {
  if (error) {
    context.done('error', error);
  }
  if(data.Payload){
   context.succeed(data.Payload)
  }
});