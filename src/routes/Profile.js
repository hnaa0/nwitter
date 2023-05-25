import { authService, dbService, storageService } from "fBase";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Nweet from "components/Nweet";

export default function Profile({ userObj }) {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [myNweets, setMyNweets] = useState([]);
  const navigate = useNavigate();
  const $fileInput = useRef();

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  // props로 받은 userObj를 이용해 nweets 필터링
  const getMyNweets = async () => {
    const myNweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt", "desc")
      .get();
    const myNweetsArr = myNweets.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setMyNweets(myNweetsArr);
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;

    setNewDisplayName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let photoUrl = "";

    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
    } else if (userObj.photoURL !== profilePhoto) {
      const photoRef = storageService
        .ref()
        .child(`${userObj.uid}/profilePhoto/${uuidv4()}`);
      const res = await photoRef.putString(profilePhoto, "data_url");
      photoUrl = await res.ref.getDownloadURL();
      await userObj.updateProfile({
        photoURL: photoUrl,
      });
    }
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();

    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setProfilePhoto(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    setProfilePhoto("");
    $fileInput.current.value = null;
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <>
      <div>
        {userObj.photoURL && (
          <img src={userObj.photoURL} width="50px" height="50px" />
        )}
        <h2>hello, {userObj.displayName}</h2>
        <form onSubmit={onSubmit}>
          <input onChange={onChange} type="text" placeholder="Display name" />
          <input
            ref={$fileInput}
            onChange={onFileChange}
            type="file"
            accept="image/*"
          />
          <button onClick={onClearAttachment}>Clear</button>
          <input type="submit" value="Update Profile" />
        </form>
        <button onClick={onLogOutClick}>Log Out</button>
      </div>
      <div>
        {myNweets &&
          myNweets.map((myNweet) => {
            return (
              <Nweet
                key={myNweet.id}
                nweetObj={myNweet}
                isOwner={myNweet.creatorId === userObj.uid}
              />
            );
          })}
      </div>
    </>
  );
}
