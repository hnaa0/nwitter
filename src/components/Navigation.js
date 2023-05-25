import React from "react";
import { Link } from "react-router-dom";

export default function Navigation({ userObj }) {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/profile">{userObj.displayName}'s Profile</Link>
      </li>
    </ul>
  );
}
