import React, { useState } from "react";
import { authService } from "fBase";
import styled from "styled-components";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, seteNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        data = await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => {
    seteNewAccount((prev) => !prev);
  };

  return (
    <>
      <LogInForm onSubmit={onSubmit}>
        <LogInInput
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <LogInInput
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <SubmitBtn
          type="submit"
          value={newAccount ? "Create Account" : "Log In"}
        />
        {error}
      </LogInForm>
      <ToggleAccount onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </ToggleAccount>
    </>
  );
}

const Input = styled.input`
  width: 100%;
  height: 40px;
  margin-bottom: 12px;
  border: 1px solid;
  border-radius: 20px;
`;

const LogInForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 320px;
  width: 100%;
  margin-bottom: 20px;
`;

const LogInInput = styled(Input)`
  border: 1px solid #e6e6e6;
  padding: 12px;
`;

const SubmitBtn = styled(Input)`
  border: none;
  background-color: var(--color-blue-100);
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: var(--color-blue-200);
  }
`;

const ToggleAccount = styled.span`
  margin-bottom: 40px;
  font-size: 14px;
  text-decoration: under;
  color: var(--color-blue-100);
  cursor: pointer;
`;
