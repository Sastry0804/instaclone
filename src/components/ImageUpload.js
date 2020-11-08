import React, { useState } from "react";
import { Button, Input } from "@material-ui/core";
import { db, storage } from "../firebase";
import firebase from "firebase";
import "./ImageUpload.css";
function ImageUpload({ username, next }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    let imgName = new Date().getTime() + "_" + image.name;
    const uploadTask = storage.ref(`images/${imgName}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(imgName)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imgSrc: url,
              username: username,
              comments: {},
            });
          })
          .catch((error) => {
            alert(error.message);
          });
      }
    );
    setCaption("");
    setImage("");
    next(false);
  };
  return (
    <div className="upload__container">
      <Input
        type="text"
        placeholder="Enter a caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <Input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
