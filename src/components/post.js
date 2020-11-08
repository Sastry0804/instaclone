import React, { useState, useEffect } from "react";
import "./post.css";
import { db } from "../firebase";
import { Avatar } from "@material-ui/core";
import firebase from "firebase";
import Comment from "./comment";
function capCase(name = "") {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
function Post({ username, caption, imgSrc, postId, loggedUser }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  useEffect(() => {
    let unsubscribe = () => {};
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp")
        .onSnapshot((snapshot) => {
          let d = snapshot.docs.map((doc) => ({
            data: doc.data(),
          }));
          setComments(d);
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);
  const postComment = (e) => {
    e.preventDefault();
    let postsCollection = db.collection("posts");
    alert(postId);
    postsCollection.doc(postId).collection("comments").add({
      text: comment,
      username: loggedUser,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={capCase(username)}
          src="/static/images/avatar/1.jpg"
        ></Avatar>
        <h3>{username}</h3>
      </div>
      <img className="post__image" src={imgSrc} alt="pos" />
      <h4 className="post__text">
        <strong>{username}: </strong>
        {caption}
      </h4>
      <div className="post__comments">
        {comments !== undefined
          ? comments.map(({ data }) => {
              return <Comment username={data.username} comment={data.text} />;
            })
          : ""}
      </div>

      {loggedUser !== undefined && loggedUser !== "" && (
        <form className="post__commentBox">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            className="post__input"
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment}
            className="post__button"
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
