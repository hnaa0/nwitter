import { dbService, storageService } from "fBase";
import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Nweet from "components/Nweet";

export default function Home({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");
  const $fileInput = useRef();

  // 🔎 nweets를 가져오는 방법1
  // // async 사용을 위해 함수로
  // const getNweets = async () => {
  //   // collection.get()은 querysnapshot을 리턴
  //   const dbNweets = await dbService
  //     .collection("nweets")
  //     .orderBy("createdAt")
  //     .get();
  //   dbNweets.forEach((document) => {
  //     const nweetObj = {
  //       ...document.data(),
  //       id: document.id,
  //     };
  //     setNweets((prev) => [nweetObj, ...prev]);
  //   });
  // };
  // useEffect(() => {
  //   getNweets();
  // }, []);

  // 🔎 nweets를 가져오는 방법2
  useEffect(() => {
    dbService
      .collection("nweets")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const nweetArr = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNweets(nweetArr);
      });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const res = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await res.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttachment("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;

    setNweet(value);
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
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    setAttachment("");
    $fileInput.current.value = null;
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={nweet}
          type="text"
          placeholder="what's on your mind?"
          maxLength={120}
        />
        <input
          ref={$fileInput}
          onChange={onFileChange}
          type="file"
          accept="image/*"
        />
        <input type="submit" value="Nweet" maxLength={120} />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}
