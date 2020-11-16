import React, {useState} from 'react';

// The API endpoint for the lambda signing function goes here:
const SIGNED_S3_URL_FUNCTION = "https://4906a70jx0.execute-api.eu-north-1.amazonaws.com/default/signedS3UploadUrl";

function App() {
  const [file, setFile] = useState();
  const [signUrl, setSignUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  async function uploadPicture(file, album) {
    console.log(file, album);
  
    // Get Signed URL
    const body = {key: file.name, type: "image/jpeg", album: album}; 
    const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"    
        },
        body: JSON.stringify(body)
    }
    const rawResponse = await fetch(SIGNED_S3_URL_FUNCTION, options);
    const data = await rawResponse.json();
    console.log("signedUrl", data.url);
    console.log(data);
    setSignUrl(data.url);
    setPhotoUrl(data.photoURL);
  
    // After you obtain the signedUrl, you upload the file directly as the body.
    try {
      const res = await fetch(data.url, { 
        method: "PUT", 
        headers: {
          "Content-Type": "image/jpeg"    
        },
        body: file
      });
      const text = await res.text();
      console.log(text);
    } catch (e) {
      console.error(e);
    }
    
  }
  

  
  function handleFileChange(event) {
    setFile(event.target.files[0]);
  }

  return (
    <>
      <h2>Upload example</h2>

      <p>Signed URL:</p> <pre>{signUrl}</pre>

      <p>Photo URL: <a href={photoUrl}>Uploaded picture</a></p>

      <div className="formContent">
        <h3>Upload picture</h3>
        <input type="file" name="uploadFile" onChange={handleFileChange}/><br/>
        <button type="submit" onClick={() => uploadPicture(file, "My album")}>Upload!</button>
      </div>
    </>
  );
}

export default App;
