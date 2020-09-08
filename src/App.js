import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import db from './firebase';

function App() {
  const [ posts, setPosts ] = useState([])

  useEffect(() => {
    db.collection('posts').onSnapShot(snapShot => {
      setPosts( snapShot.docs.map(doc => doc.data()) );
    })
  }, [])
  
  return (
    <div className="app">
      <div className="app__header">
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
      </div>

    {
      posts.map(post => (
        <Post username={post.username} caption={post.caption} imgUrl={post.imgUrl}/>
      ))
    }

    </div>
  );
}

export default App;
