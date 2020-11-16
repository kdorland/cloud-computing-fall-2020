const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event) => {
  const album = event.pathParameters.album;
  
  const params = {
    TableName: "Albums",
    Key: {
      "name": album
    }
  };
  
  let data = {};
  try {
    data = await docClient.get(params).promise();
    console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
  }
    
  const response = {
    statusCode: 200,
    body: JSON.stringify(data.Item),
    headers: { 
      "Access-Control-Allow-Origin": "*" 
    }
  };
  return response;
};
