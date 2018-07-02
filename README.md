# GetToThe.LinkAsap
* Shorten given URL. The shortened links are in the format of adjective + animal + verb.
* Utilizing error rediction and meta redirection of AWS S3. Combined with CDN to ensures fast and realiable service.
* Accompanied with AWS Lambda for a serverless infrastructure.

# Roadmap
* URL analytic available to users
  * Using DynamoDB to store log
  * Process log from CloudTrail
    * Using AWS Lambda to process log
    * Triggered every 1 minute
