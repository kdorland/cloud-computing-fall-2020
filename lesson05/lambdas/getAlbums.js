const AWS = require('aws-sdk');

exports.handler = async(event) => {
  console.log("Starting.");
  const docClient = new AWS.DynamoDB.DocumentClient();
  
  const params = {
    TableName: "Albums",
    ProjectionExpression: "#nm",
    ExpressionAttributeNames: {
      "#nm": "name",
    },
  };
  const data = await docClient.scan(params).promise();
  console.log("Scan succeeded.", data.Items);

  const body = JSON.stringify(data.Items);
  console.log(body);
  const response = {
    statusCode: 200,
    body: body,
    headers: { 
      "Access-Control-Allow-Origin": "*" 
    }
  };
  return response;
};
