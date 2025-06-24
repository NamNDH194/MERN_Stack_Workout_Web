import React from "react";
import Signup from "./Signup";
import Signin from "./Signin";

function Auth() {
  return (
    <div class="AuthContainer" id="AuthContainer">
      <Signup />
      <Signin />
      <div class="toggle-container">
        <div class="toggle">
          <div class="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button
              class="hidden"
              id="login"
              onClick={() => {
                if (document.querySelector("#AuthContainer")) {
                  document
                    .querySelector("#AuthContainer")
                    .classList.remove("active");
                }
              }}
            >
              Sign In
            </button>
          </div>
          <div
            class="toggle-panel toggle-right"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <h1>Hello, Buddy!</h1>
            <p>
              Register with your personal details to use all of site features
            </p>
            <button
              class="hidden"
              id="register"
              onClick={() => {
                if (document.querySelector("#AuthContainer")) {
                  document
                    .querySelector("#AuthContainer")
                    .classList.add("active");
                }
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
