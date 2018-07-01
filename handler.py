import json
import boto3
import random
bucket = 'BUCKET_NAME'

def hello(event, context):
    s3 = boto3.resource('s3')
    rand = str(random.randint(1, 10000000))
    l = '/tmp/' + rand + '.html'
    f = open(l, 'w')
    m = "Hello " + rand + "!"
    f.write(m)
    f.close()

    s3.Object(bucket, rand + '.html').put(Body=open(l, 'rb'), ACL='public-read', ContentType='text/html', WebsiteRedirectLocation='http://google.com')

    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "data": l,
        "input": event,
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response
