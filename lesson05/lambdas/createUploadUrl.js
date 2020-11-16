const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function createAlbum(name) {
  const getParams = { TableName: "Albums", Key: { "name": name }};
  const putParams = {
    TableName: "Albums",
    Item: {
      "name": name,
      "photos": []
    }
  };
  
  try {
    const getData = await docClient.get(getParams).promise(); 
    console.log("getData.Item", getData.Item);
    if (!getData.Item) {
      console.log("Creating new album!");
      try {
        const putData = await docClient.put(putParams).promise();
        console.log("Putting new album " + putData);
      } catch (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function savePhoto(fileName, albumTitle, photoTitle) {
  const params = {
    TableName: "Albums",
    Key: {
      "name": albumTitle
    },
    UpdateExpression: "SET #p = list_append(#p, :vals)",
    ExpressionAttributeNames: {
       "#p": "photos"
    },
    ExpressionAttributeValues: {
      ":vals": [{filename: fileName, title: photoTitle}]    
    },
    ReturnValues: "UPDATED_NEW"
  };
  
  try {
    const updateData = await docClient.update(params).promise();
    console.log("Updated item:", JSON.stringify(updateData, null, 2));
  } catch (err) {
    console.error(err);
  }
}

exports.handler = async(event) => {
  console.log(event)
  const s3 = new AWS.S3({signatureVersion: 'v4'});
  const {key, type, album} = JSON.parse(event.body);
  const bucket = "krdo-photos-v1";
  const filepath = `https://${bucket}.s3.eu-central-1.amazonaws.com/${key}`;
  
  const url = await s3.getSignedUrlPromise('putObject', {
    Bucket: bucket,
    Key: key,
    Metadata: {
      album: album, 
    },
    ContentType: type,
    Expires: 3600
  });
  
  await createAlbum(album);
  await savePhoto(filepath, album, key);
  
  const response = {
    statusCode: 200,
    body: url,
    headers: { 
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Request-Method": "*"
    }
  };
  return response;
};
