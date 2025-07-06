import React, { useState } from "react";
import { API_ROOT } from "../ultilities/constants";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_ROOT}/v1/user/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (!response.ok) {
      toast.error(json.message);
    }
    if (response.ok) {
      const user = { ...json };

      const decoded = jwtDecode(user?.token);
      user.userId = decoded._id;

      localStorage.setItem("user", JSON.stringify(json));

      dispatch({ type: "LOGIN", payload: user });
      navigate("/");
    }
  };
  return (
    <div class="form-container sign-in">
      <form>
        <h1>Sign In</h1>
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
        <a href="#" id="forgetPassword">
          Forget Your Password?
        </a>
        <button onClick={handleSignIn}>Sign In</button>
      </form>
    </div>
  );
}

export default Signin;
