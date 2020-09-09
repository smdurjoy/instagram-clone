import React, {useState} from 'react'
import { TextareaAutosize, Button } from '@material-ui/core'
import ImageIcon from '@material-ui/icons/Image'
import firebase from 'firebase'
import { db, storage } from './firebase'
import './ImageUpload.css'

function ImageUpload( {username} ) {
    const [ caption, setCaption ] = useState('');
    const [ image, setImage ] = useState(null);
    const [ progress, setProgress ] = useState(0);
    const [ imageName, setImageName ] = useState('');

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0])
            setImageName(`Selected Image: ${e.target.files[0].name}`)
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },

            (error) => {
                // error function ...
                console.log(error)
                alert(error.message)
            },

            () => {
                // complete the function
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()   
                    .then(url => {
                        // post image inside db
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imgUrl: url,
                            username: username,
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            } 
        )
    };

    return (
        <div>
            <progress value={progress} max="100"></progress>
            <div className="imageUpload">
                <TextareaAutosize
                    rowsMax={4}
                    rowsMin={2}
                    placeholder="Enter Caption ..."
                    onChange={(e) => setCaption(e.target.value)}
                    className="imageUpload__caption"
                />
                
                <Button variant="outlined" color="primary" component="label">
                    <input type="file" onChange={handleChange} style={{ display: "none" }} />
                    <ImageIcon/>
                </Button>
            </div>

            <h5>{imageName}</h5>

            <Button variant="contained" color="primary" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )   
}

export default ImageUpload
