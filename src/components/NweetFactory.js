import React from "react";
import { storageService, dbService } from "fBase";
import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export default function NweetFactory({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const $fileInput = useRef();

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
  );
}
