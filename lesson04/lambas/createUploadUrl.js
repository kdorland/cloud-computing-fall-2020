/*
 * The purpse of this AWS Lambda function is to return a "signed S3 URL" for uploading to a bucket. 
 * The URL expires after 10 minutes.
 * 
 * Input:
 * - key (in the bucket)
 * - contentType
 * - album (this is metadata)
 * 
 * Output:
 * - url (in the body)
 */

const AWS = require('aws-sdk');

exports.handler = async(event) => {
  const s3 = new AWS.S3({signatureVersion: 'v4'});
  
  let data = "";
  try {
    data = JSON.parse(event.body);
  } catch (e) {
    console.log(e.msg);
    const response = {
     statusCode: 200,
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Request-Method": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({
        "msg": "no input data"
      })
    };
    return response;
  }
  
  const {key, type, album} = data;
  const bucket = "krdo-my-bucket";
  const photoURL = `https://${bucket}.s3.eu-north-1.amazonaws.com/${key}`;
  
  const url = await s3.getSignedUrlPromise('putObject', {
    Bucket: bucket,
    Key: key,
    Metadata: {
      album: album, 
    },
    ContentType: type,
    Expires: 3600
  });
    
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      url,
      photoURL
    }),
    headers: { 
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Request-Method": "*",
      "Access-Control-Allow-Headers": "*"
    }
  };
  return response;
};