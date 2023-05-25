import { dbService } from "fBase";
import React, { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import userEvent from "@testing-library/user-event";

export default function Home({ userObj }) {
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

  return (
    <div>
      <NweetFactory userObj={userObj} />
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
