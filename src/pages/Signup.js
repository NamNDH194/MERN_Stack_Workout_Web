import React, { useState } from "react";
import { toast } from "react-toastify";
import { API_ROOT } from "../ultilities/constants";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password did not match! Please try again!"
      );
    } else {
      const response = await fetch(`${API_ROOT}/v1/user/signup`, {
        method: "POST",
        body: JSON.stringify({ userName, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (!response.ok) {
        toast.error(json.message);
      }
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(json));
        dispatch({ type: "LOGIN", payload: json });
        navigate("/");
      }
    }
  };
  return (
    <div class="form-container sign-up">
      <form>
        <h1>Create Account</h1>
        <input
          type="text"
          placeholder="User name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleSignUp}>Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
