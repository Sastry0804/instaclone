import "./App.css";
import Header from "./components/header";
import Post from "./components/post";
import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./components/ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    zIndex: 9999999,
  },
}));
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openLogin, setLoginOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalStyle] = useState(getModalStyle);
  const [user, setUser] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);
  function handleUploadClose() {
    setOpenUpload(false);
  }
  function handleUploadOpen() {
    setOpenUpload(true);
  }
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  function handleLoginOpen() {
    setLoginOpen(true);
  }
  function handleLoginClose() {
    setLoginOpen(false);
  }
  function handleSignUp(e) {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        setOpen(false);
        setUsername("");
        setPassword("");
        setEmail("");

        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => {
        alert(error.message);
        setUsername("");
        setPassword("");
        setEmail("");
      });
  }
  function handleLogin(e) {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((v) => {
        setLoginOpen(false);

        setUsername(v.displayName);
        setPassword("");
        setEmail("");
      })
      .catch((error) => {
        alert(error.message);
        setUsername("");
        setPassword("");
        setEmail("");
      });
  }
  useEffect(() => {
    const upd = db.collection("posts").onSnapshot((snap) => {
      let data = snap.docs.map((doc) => ({
        i: doc.id,
        p: doc.data(),
      }));
      data = data.sort((a, b) => {
        return b.p.timestamp - a.p.timestamp;
      });
      setPosts(data);
    });
    return () => {
      upd();
    };
  }, []);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        setLoggedInUser(user);
        setUser(user);
      } else {
        setLoggedIn(false);
        setLoggedInUser(null);
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [loggedIn, loggedInUser]);
  return (
    <div className="App">
      <Header></Header>
      <div className="auth__container">
        {!loggedIn ? (
          <div className="user__handle">
            <Button onClick={handleOpen}>Sign Up</Button>
            <Button onClick={handleLoginOpen}>Login</Button>
          </div>
        ) : (
          <div className="user__handle">
            {user ? (
              <Button onClick={handleUploadOpen}>Upload Post</Button>
            ) : (
              ""
            )}
            <Button onClick={(e) => auth.signOut()}>Logout</Button>
          </div>
        )}
      </div>
      <div className="mt80">
        {user ? (
          <Modal open={openUpload} onClose={handleUploadClose}>
            <div style={modalStyle} className={classes.paper}>
              <form className="user__form">
                <div className="ins__logo">Instaclone</div>
                <ImageUpload username={user.displayName} next={setOpenUpload} />
              </form>
            </div>
          </Modal>
        ) : (
          ""
        )}
        <div>
          <Modal open={open} onClose={handleClose}>
            <div style={modalStyle} className={classes.paper}>
              <form className="user__form">
                <div className="ins__logo">Instaclone</div>
                <Input
                  type="text"
                  value={username}
                  placeholder="Enter Username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                ></Input>
                <Input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                ></Input>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                ></Input>
                <Button classtype="submit" onClick={handleSignUp}>
                  SignUp
                </Button>
              </form>
            </div>
          </Modal>
          <Modal open={openLogin} onClose={handleLoginClose}>
            <div style={modalStyle} className={classes.paper}>
              <form className="user__form">
                <div className="ins__logo">Instaclone</div>
                <Input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                ></Input>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                ></Input>
                <Button type="submit" onClick={handleLogin}>
                  LogIn
                </Button>
              </form>
            </div>
          </Modal>
        </div>
        <div className="post__container">
          {posts !== undefined ? (
            posts.map(({ i, p }) => (
              <Post
                username={p.username}
                caption={p.caption}
                imgSrc={p.imgSrc}
                postId={i}
                key={i}
                loggedUser={user ? user.displayName : ""}
              />
            ))
          ) : (
            <h1>That's all for now</h1>
          )}
        </div>
      </div>
      <div className="insta__embed"></div>
    </div>
  );
}

export default App;
