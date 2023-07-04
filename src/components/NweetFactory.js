import React from "react";
import { storageService, dbService } from "fBase";
import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";

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
    <Container>
      <Form onSubmit={onSubmit}>
        <Textarea
          onChange={onChange}
          value={nweet}
          type="text"
          placeholder="what's on your mind?"
          maxLength={120}
        />
        <InputGroup>
          <FileGroup>
            <FileBox>
              <FileBtnLabel htmlFor="fileBtn">
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
              </FileBtnLabel>
              <input
                id="fileBtn"
                ref={$fileInput}
                onChange={onFileChange}
                type="file"
                accept="image/*"
              />
            </FileBox>
            {attachment && (
              <AttBox>
                <AttClearBtn onClick={onClearAttachment}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-x-lg"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                  </svg>
                </AttClearBtn>
                <img src={attachment} alt="이미지" width="50px" height="32px" />
              </AttBox>
            )}
          </FileGroup>
          <SubmitBox>
            <SubmitBtn type="submit" value="" id="submitBtn" maxLength={120} />
            <SubmitBtnLabel htmlFor="submitBtn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-up"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
                />
              </svg>
            </SubmitBtnLabel>
          </SubmitBox>
        </InputGroup>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  border-bottom: 1px solid var(--color-gray-300);
`;

const Form = styled.form`
  width: 100%;
  padding: 4px 4px;
`;

const Textarea = styled.textarea`
  height: 80px;
  width: 100%;
  resize: none;
  font-size: 16px;
  padding: 8px;
  color: white;
  border: none;
  border-bottom: 1px solid var(--color-gray-500);
  background-color: var(--color-navy-500);
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }

  &:focus {
    outline: none;
  }
`;

const InputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 8px 0;
`;

const FileGroup = styled.div`
  display: flex;
`;

const FileBox = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
  background-color: var(--color-blue-100);
  border-radius: 50%;
  cursor: pointer;

  & > input {
    position: absolute;
    width: 1px;
    height: 1px;
    top: 0;
    left: 0;
    overflow: hidden;
    opacity: 0;
  }
`;

const FileBtnLabel = styled.label`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;

  & > svg {
    width: 20px;
    height: 20px;
    fill: white;
  }
`;

const AttBox = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
`;

const AttClearBtn = styled.button`
  position: relative;
  width: 36px;
  height: 100%;
  margin: 0 8px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background-color: var(--color-blue-100);

  & > svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    fill: white;
    cursor: pointer;
  }
`;

const SubmitBox = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
`;

const SubmitBtn = styled.input`
  width: 100%;
  height: 100%;
  font-size: 20px;
  border-radius: 50%;
  border: none;
  background-color: var(--color-blue-100);
  cursor: pointer;
`;

const SubmitBtnLabel = styled.label`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;

  & > svg {
    width: 20px;
    height: 20px;
    fill: white;
  }
`;
