import React, {useEffect, useState} from 'react';
import {useAuth} from "../contexts/AuthContext";
import app from "../firebase";
import { firebase } from "@firebase/app";

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
                    <div className="aComment">
                        <b>From: {comment.from}</b> <br />
                        {comment.comment}
                    </div>
                ))
            }
        </div>
    )
}