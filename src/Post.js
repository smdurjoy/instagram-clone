import React from 'react'
import './Post.css';
import Avatar from '@material-ui/core/Avatar'

function Post({ username, caption, imgUrl }) {
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
        </div>
    )
}

export default Post
