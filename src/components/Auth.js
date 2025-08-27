// src/components/Auth.js
import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function Auth({ user, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignIn) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCred.user);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCred.user);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (user) {
    return (
      <div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleAuth} style={{ marginBottom: "1em" }}>
      <h2>{isSignIn ? "Sign In" : "Sign Up"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      /><br />
      <button type="submit">{isSignIn ? "Sign In" : "Sign Up"}</button>
      <span style={{ marginLeft: "1em", cursor: "pointer", color: "blue" }} onClick={() => { setIsSignIn(s => !s); setError("");}}>
        {isSignIn ? "Need to sign up?" : "Have an account?"}
      </span>
      <div style={{ color: "red" }}>{error}</div>
    </form>
  );
}
