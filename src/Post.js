import React, {useState, useEffect} from 'react'
import './Post.css';
import Avatar from '@material-ui/core/Avatar'
import { db } from './firebase';
import firebase from 'firebase'

function Post({ username, caption, imgUrl, postId, user }) {
    const [ comments, setComments ] = useState([]);
    const [ comment, setComment ] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe = db
                .collection('posts') 
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapShot) => {
                    setComments(snapShot.docs.map((doc) => doc.data()))
                });
        }

        return () => {
            unsubscribe();
        };

    }, [postId])


    const postComment = (e) => {
        e.preventDefault();
        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment('');
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt="durJoy"
                    src="/static/images/avatar/1.jpg"
                />
                <h4>{username}</h4>
            </div>
            <img className="post__image" src={imgUrl} alt=""/>
            <p className="post__caption"><strong>{username} </strong> {caption}</p>

            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>
            <form className="post__commentBox">
                <input className="post__commentBoxInput" type="text" placeholder="Add a comment ..." value={comment} onChange={(e) => setComment(e.target.value)}/>
                <button className="post__commentBoxButton" disabled={!comment} onClick={postComment}>Post</button>
            </form>
        </div>
    )
}

export default Post
    