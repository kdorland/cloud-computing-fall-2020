const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event) => {
  const album = event.pathParameters.album;
  
  const params = {
    TableName: "Albums",
    Item: {
      "name": album,
      "photos": []
    }
  };

  try {
    const data = await docClient.put(params).promise();
    console.log("data", data);
  } catch (err) {
    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
  }
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({msg: "album created"}),
    headers: { 
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Request-Method": "*"
    }
  };
  return response;
};
