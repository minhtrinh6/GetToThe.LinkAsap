import json
import boto3
import random
bucket = 'BUCKET_NAME'

def hello(event, context):
    s3 = boto3.resource('s3')
    rand = str(random.randint(1, 10000000))
    link = event['body']
    if "http" not in link:
        link = "http://" + link
        
    s3.Object(bucket, 'routes/' + rand + '.html').put(Body="", ACL='public-read', ContentType='text/html', WebsiteRedirectLocation=link)

    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : True
        },
        "body": json.dumps({
            "url": rand,
            # "event": test
        })
    }

    return response
