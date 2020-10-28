const AWS = require("aws-sdk");

async function run() {
  async function getAwsCredentials() {
    return new Promise(function (resolve, reject) {
      AWS.config.getCredentials(function(err) {
        if (err) {
          reject(err.stack);
        } else {
          console.log("Access key used:", AWS.config.credentials.accessKeyId);
          resolve(AWS.config.credentials);
        }
      });
    });
  }
  
  // Try to get the credentials
  try {
    await getAwsCredentials();
    console.log("Credentials ok");  
  } catch (error) {
    console.log("Credentials not ok", error);  
  }

  // Set the AWS region (not really needed here since S3 buckets are global)
  AWS.config.update({region: 'eu-central-1'}); // Frankfurt
  
  // Create S3 service object (to access S3 API)
  const s3 = new AWS.S3({apiVersion: '2006-03-01'}); // Yep, API hasn't changed in a while
  
  // List all S3 buckets
  const response = await s3.listBuckets().promise();
  console.log("These are your buckets:", response)

  // You can access many other methods on 's3' object. 
  // See https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html for a list of methods.
}

run();