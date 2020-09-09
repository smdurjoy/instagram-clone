import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button, Input } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [ posts, setPosts ] = useState([]);
  const [ open, setOpen ] = useState(false);
  const [ openSignIn, setOpenSignIn ] = useState(false);
  const [ username, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ user, setUser ] = useState(null);

  useEffect(() => {
    db.collection('posts').onSnapshot(snapShot => {
      setPosts(snapShot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if(authUser) {
        // if user logged in
        setUser(authUser)
        console.log(authUser)

      } else {
        // if user logged out
        setUser(null)
      }
    })

    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username])


  const signup = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message))
    
    setOpen(false)
  }

  const signin = (e) => {
    e.preventDefault(); 

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false)  
  }

  return (
    <div className="app">
      {/* sign up modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <form className="app__signup">
              <center>
                <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
              </center>
              <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              <Input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
              <Button onClick={signup}>Sign Up</Button>
            </form>
          </div>
        </Fade>
      </Modal>

      {/* sign in modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openSignIn}>
          <div className={classes.paper}>
            <form className="app__signup">
              <center>
                <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
              </center>
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              <Input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
              <Button onClick={signin}>Sign In</Button>
            </form>
          </div>
        </Fade>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
        {user ? (
          <div className="app__signupContainer">
            <Button onClick={() => auth.signOut()}>Logout</Button>
          </div>
        ) : (
          <div className="app__signupContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

    {
      posts.map(({id, post}) => (
        <Post key={id} username={post.username} caption={post.caption} imgUrl={post.imgUrl}/>
      ))
    }

    </div>
  );
}

export default App;
