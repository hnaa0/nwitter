import { authService, firbaseInstance } from "fBase";
import React from "react";
import AuthForm from "components/AuthForm";

export default function Auth() {
  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;

    if (name == "google") {
      provider = new firbaseInstance.auth.GoogleAuthProvider();
    } else if (name == "github") {
      provider = new firbaseInstance.auth.GithubAuthProvider();
    }

    const data = await authService.signInWithPopup(provider);
  };

  return (
    <div>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name="google">
          Continue with Google
        </button>
        <button onClick={onSocialClick} name="github">
          Continue with Github
        </button>
      </div>
    </div>
  );
}
