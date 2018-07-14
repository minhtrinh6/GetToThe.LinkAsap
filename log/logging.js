const AWS = require('aws-sdk');
const iotData = new AWS.IotData({endpoint: 'a3g47r8brmmqer.iot.us-east-1.amazonaws.com'});
var Redis = require('redis');
var client = Redis.createClient({host: '52.201.47.240', password: 'CuteShibaBouncing'})

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const uri = request.uri;
    

    var link = String(uri).replace("/", "").toLowerCase();
    client.get(link, function(err, result) {
      // TODO: CHECK FOR KEY NOT EXIST
      const iotParams = {
        payload: JSON.stringify({ link: link, count: parseInt(result, 10) + 1}),
        topic: `update/${link}`
      }
      iotData.publish(iotParams, (err, data) => {})
      client.incr(link, (a, b) => {
        client.unref()
      })
    })
}