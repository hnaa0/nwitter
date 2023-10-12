import { authService, dbService, storageService } from "fBase";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Nweet from "components/Nweet";
import styled from "styled-components";

export default function Profile({ refreshUser, userObj }) {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [myNweets, setMyNweets] = useState([]);
  const navigate = useNavigate();
  const $fileInput = useRef();

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
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
    } else if (profilePhoto === "") {
      await userObj.updateProfile({
        photoURL: userObj.photoURL,
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

    refreshUser();
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

  // props로 받은 userObj를 이용해 nweets 필터링, 실시간반영
  useEffect(() => {
    dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const myNweetsArr = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMyNweets(myNweetsArr);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <ProfileGroup>
        <ProfileBox>
          {userObj.photoURL && (
            <ProfilePhoto
              src={userObj.photoURL}
              alt="이미지"
              width="50px"
              height="50px"
            />
          )}
          <h2>{userObj.displayName}</h2>
        </ProfileBox>
        <ProfileForm onSubmit={onSubmit}>
          <DisplayNameInput
            onChange={onChange}
            type="text"
            placeholder="Display name"
            maxLength={20}
          />
          <FileInputLabel htmlFor="fileInput">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-image"
              viewBox="0 0 16 16"
            >
              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
            </svg>
          </FileInputLabel>
          <FileInput
            id="fileInput"
            ref={$fileInput}
            onChange={onFileChange}
            type="file"
            accept="image/*"
          />
          <AttBtn onClick={onClearAttachment}>Clear</AttBtn>
          <SubmitBtn type="submit" value="Update Profile" />
        </ProfileForm>
        <LogoutBtn onClick={onLogOutClick}>Log Out</LogoutBtn>
      </ProfileGroup>
      <>
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
      </>
    </Container>
  );
}

const Container = styled.div`
  width: 375px;
`;

const Input = styled.input`
  width: 100%;
  height: 32px;
  color: #fff;
`;

const ProfileGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 4px;
  border-bottom: 1px solid var(--color-gray-100);
`;

const ProfileBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-gray-500);

  & h2 {
    font-size: 24px;
  }
`;

const ProfilePhoto = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 8px;
`;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  padding: 12px 0;
`;

const DisplayNameInput = styled(Input)`
  margin-bottom: 12px;
  border: none;
  border-bottom: 1px solid var(--color-blue-200);
  background-color: var(--color-navy-500);

  &:focus {
    outline: none;
    border-bottom: 1px solid var(--color-blue-100);
  }
`;

const FileInputLabel = styled.label`
  position: relative;
  width: 50%;
  height: 32px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  background-color: #fff;

  & svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    fill: #000;
  }
`;

const FileInput = styled(Input)`
  width: 0;
  height: 0;
  overflow: hidden;
`;

const AttBtn = styled.button``;

const SubmitBtn = styled(Input)`
  background-color: var(--color-blue-100);
  border: none;
  border-radius: 20px;
  cursor: pointer;
`;

const LogoutBtn = styled.button`
  border: none;
  font-weight: bold;
  text-decoration: underline;
  color: red;
  background-color: var(--color-navy-500);
  margin-left: auto;
  cursor: pointer;
`;
