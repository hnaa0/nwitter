import { dbService, storageService } from "fBase";
import React, { useState } from "react";
import styled from "styled-components";

export default function Nweet({ nweetObj, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNweNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("이 트윗을 삭제하시겠습니까?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      if (nweetObj.attachmentUrl !== "")
        await storageService.refFromURL(nweetObj.attachmentUrl).delete();
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
    <NweetContainer>
      {editing ? (
        <EditBox>
          <EditForm onSubmit={onSubmit}>
            <EditInput
              onChange={onChange}
              type="text"
              placeholder="Edit your Nweet"
              value={newNweet}
              required
              autoFocus
            />
            <EditSubmitBox>
              <EditSubmitBtnLabel htmlFor="editSubmit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-check-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                </svg>
              </EditSubmitBtnLabel>
              <EditSubmitBtn
                id="editSubmit"
                type="submit"
                value="Update Nweet"
              />
            </EditSubmitBox>
          </EditForm>
          <EditCancelBtn onClick={toggleEditing}>
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
          </EditCancelBtn>
        </EditBox>
      ) : (
        <>
          <NweetTxt>{nweetObj.text}</NweetTxt>
          {nweetObj.attachmentUrl && (
            <NweetImg src={nweetObj.attachmentUrl} alt="이미지" />
          )}
          {isOwner && (
            <Btnbox>
              <Btn onClick={onDeleteClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-trash"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                </svg>
              </Btn>
              <Btn onClick={toggleEditing}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                </svg>
              </Btn>
            </Btnbox>
          )}
        </>
      )}
    </NweetContainer>
  );
}

const NweetContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  height: fit-content;
  min-height: 120px;
  border-bottom: 1px solid var(--color-gray-500);
`;

const NweetTxt = styled.h4`
  margin-bottom: 12px;
`;

const NweetImg = styled.img`
  width: 100%;
`;

const Btnbox = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

const Btn = styled.button`
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--color-blue-100);
  background-color: var(--color-navy-500);
  margin-left: 4px;
  cursor: pointer;

  & svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    fill: #fff;
  }
`;

const EditBox = styled.div`
  display: flex;
  align-items: center;
`;

const EditCancelBtn = styled(Btn)`
  margin-left: auto;
`;

const EditForm = styled.form`
  display: flex;
  align-items: center;
`;

const EditInput = styled.input`
  height: 40px;
  width: 290px;
  color: white;
  padding: 4px;
  border: none;
  background-color: var(--color-navy-500);

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }

  &:focus {
    outline: none;
  }
`;

const EditSubmitBox = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-blue-100);
  border-radius: 50%;
`;

const EditSubmitBtn = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  top: 0;
  left: 0;
  overflow: hidden;
  opacity: 0;
`;

const EditSubmitBtnLabel = styled.label`
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
