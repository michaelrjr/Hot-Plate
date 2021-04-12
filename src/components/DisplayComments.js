/*
    To Do:
        -- Refactor this in the same way as DisplayPost.js, ie:
            -- Create a new file DisplayEachComment.js
            -- Call that file for each iteration of the array (as with DisplayPost)
            -- Inside each "DisplayEachComment", do a getData to get the userData for that comment.
            -- Do this up the top, as component loads, same as in DisplayEachPost.js
            -- Then go at it, insert avatar etc.
*/


import React, {useEffect, useState} from 'react';
import app from "../firebase";
import DisplayEachComment from './DisplayEachComment';

export default function DisplayComments(props){
    const dbRef = app.firestore().collection("feed");
    const postRef = dbRef.doc(props.postID);
    const commentSectionRef = postRef.collection(props.commentSectionID);
    const [commentsArray, setCommentsArray] = useState();

    useEffect(() => {
        const getData = async () => {
            commentSectionRef.orderBy("timestamp", "desc").onSnapshot((snapshot) => {
                setCommentsArray(snapshot.docs.map(  (doc) => doc.data()  ));
            });
        }
        getData();
      }, []);

    return(
        <div className="displayComments">
            { commentsArray &&
                commentsArray.map((comment) => (
                    <DisplayEachComment 
                        key = {comment.timestamp}
                        email = {comment.from}
                        comment = {comment.comment}
                        timestamp = {comment.timestamp}
                    />
                ))
            }
        </div>
    )
}