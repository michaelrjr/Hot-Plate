import React, {useEffect, useState} from 'react';
import app from "../firebase";

export default function DisplayEachComment(props){
    const userDBRef = app.firestore().collection("Users");
    const [ currentUserData, setCurrentUserData ] = useState();

    useEffect(() => {
        let isMounted = true;
        userDBRef.doc(props.email).get().then( (doc) => {
            if(isMounted) setCurrentUserData( doc.data() );
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        return () => isMounted = false;
      }, []);

    return(
        <div className="aComment mt-3">
                <img src={
                    currentUserData?.avatar ? currentUserData?.avatar : "defaultuser.png"
                } className="rounded-circle d-inline-block mr-3" height="30" width="30"/>
            <div className="w-75 d-inline-block">
                <small><b>  { props.firstName ? props.firstName+" " : currentUserData?.firstName+" " }
                            {props.lastName ? props.lastName+" " : currentUserData?.lastName+" " }
                </b></small>
                <small className="align-self-start comment-timestamp">
                    {new Date(props.timestamp?.toDate()).toLocaleString()}
                </small><br />
                <div className="commentMain d-block">
                    {props.comment}
                </div>
            </div>
        </div>
    )
}