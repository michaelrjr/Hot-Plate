import React, {useEffect, useState, useRef} from 'react';
import app from "../firebase";
import DisplayEachComment from './DisplayEachComment';
import { v4 as uuidv4 } from "uuid";
import CommentBox from "./CommentBox";
import { FaRegCommentDots } from "react-icons/fa";

export default function DisplayComments(props){
    const dbRef = app.firestore().collection("feed");
    const postRef = dbRef.doc(props.postID);
    const [commentsArray, setCommentsArray] = useState();
    const bottomElement = useRef();
    const [showCommentBox, setShowCommentBox] = useState(false);

    
    const commentSectionRef = postRef.collection(props.commentSectionID);
    
    useEffect(() => {
        const unsub = getData();
        return () => unsub();
    }, []);

    function getData(){
        return commentSectionRef.orderBy("timestamp", "asc").onSnapshot((snapshot) => {
            setCommentsArray(snapshot.docs.map(  (doc) => doc.data()  ));
            scrollToBottomElement();
        });
    }

    function scrollToBottomElement(){
        if(bottomElement.current){
            bottomElement.current.scrollTop = bottomElement.current.scrollHeight;
        }
    }

    const showCommentInputBox = () => {
      setShowCommentBox(!showCommentBox);
    };

    return(
            <div className="displayComments" ref={bottomElement}>
                { commentsArray?.map((comment) => {
                        return(
                            <div key = {uuidv4()}>
                                <DisplayEachComment
                                    email = {comment.from}
                                    comment = {comment.comment}
                                    timestamp = {comment.timestamp}
                                />
                            </div>
                        )
                    })
                }
                { commentsArray?.length==0 &&
                    <div className="emptyCommentSection mt-2">
                        No comments yet ... be the first to leave a comment!
                    </div> 
                } 
                <div className="d-block mt-2 w-100">
                    {!showCommentBox &&
                        <button
                            className="btn btn-comment btn-sm w-100 d-inline"
                            onClick={showCommentInputBox}
                        >
                            <div className="d-inline mr-1">
                            <FaRegCommentDots />
                            </div>
                            <div className="d-inline">Leave a Comment</div>
                        </button>
                    }
                
                    {showCommentBox && (
                        <CommentBox
                        postID = {props.postID}
                        commentSectionID = {props.commentSectionID}
                        setShowCommentBox = {setShowCommentBox}
                        scrollToBottomElement = {scrollToBottomElement}
                        />
                    )}
                </div>
            </div>
    )
}