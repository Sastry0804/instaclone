import React from "react";
import "./comment.css";
function Comment({ username, comment }) {
  return (
    <div className="comment">
      <strong>{username}</strong>: {comment}
    </div>
  );
}

export default Comment;
