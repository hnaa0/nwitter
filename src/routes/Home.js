import { dbService } from "fBase";
import React, { useEffect, useState } from "react";
import Nweet from "components/Nweet";

export default function Home({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

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
    await dbService.collection("nweets").add({
      text: nweet,
      createdAt: Date.now(),
      createrId: userObj.uid,
    });
    setNweet("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;

    setNweet(value);
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
        <input type="submit" value="Nweet" maxLength={120} />
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.createrId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}
