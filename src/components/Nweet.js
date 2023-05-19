import { dbService } from "fBase";
import React, { useState } from "react";

export default function Nweet({ nweetObj, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNweNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("이 트윗을 삭제하시겠습니까?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
    }
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text: newNweet,
    });
    setEditing(false);
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweNweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              onChange={onChange}
              type="text"
              placeholder="Edit your Nweet"
              value={newNweet}
              required
            />
            <input type="submit" value="Update Nweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
}
