import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export default function Navigation({ userObj }) {
  return (
    <NavUl>
      <LiTwitter>
        <Link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="currentColor"
            className="bi bi-twitter"
            viewBox="0 0 16 16"
          >
            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
          </svg>
        </Link>
      </LiTwitter>
      <LiProfile>
        <Link to="/profile">
          <div>
            <img src={userObj.photoURL} alt="프로필" />
          </div>
        </Link>
      </LiProfile>
    </NavUl>
  );
}

const NavUl = styled.ul`
  position: relative;
  margin-bottom: 20px;
  width: 375px;
  height: 66px;
  padding: 8px;
  border-bottom: 1px solid var(--color-gray-500);
`;

const LiTwitter = styled.li`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  & svg {
    fill: var(--color-blue-200);
  }
`;

const LiProfile = styled.li`
  position: absolute;
  right: 0;

  & div {
    width: 50px;
    height: 50px;
    overflow: hidden;
    border-radius: 50%;
    border: 2px solid transparent;
    background-image: linear-gradient(#fff, #fff),
      linear-gradient(
        to bottom,
        var(--color-gray-100) 0%,
        var(--color-blue-100) 100%
      );
    background-origin: border-box;
    background-clip: content-box, border-box;
  }

  & img {
    width: 50px;
    height: 50px;
    object-fit: cover;
  }
`;
