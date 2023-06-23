import { authService, firbaseInstance } from "fBase";
import React from "react";
import AuthForm from "components/AuthForm";
import styled from "styled-components";
import { BsGoogle, BsGithub, BsTwitter } from "react-icons/bs";

export default function Auth() {
  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;

    if (name === "google") {
      provider = new firbaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firbaseInstance.auth.GithubAuthProvider();
    }

    await authService.signInWithPopup(provider);
  };

  return (
    <>
      <BsTwitter
        size={40}
        color="var(--color-blue-100)"
        style={{ marginBottom: 20 }}
      />
      <AuthForm />
      <SocialBtns>
        <LogInGoogle onClick={onSocialClick} name="google">
          Continue with Google
          <BsGoogle style={{ marginLeft: 4 }} />
        </LogInGoogle>
        <LogInGithub onClick={onSocialClick} name="github">
          Continue with Github
          <BsGithub style={{ marginLeft: 4 }} />
        </LogInGithub>
      </SocialBtns>
    </>
  );
}

const Button = styled.button`
  height: 40px;
  width: 150px;
  font-size: 12px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  background-color: #fff;
`;

const SocialBtns = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 320px;
  width: 100%;
`;

const LogInGoogle = styled(Button)``;

const LogInGithub = styled(Button)``;
