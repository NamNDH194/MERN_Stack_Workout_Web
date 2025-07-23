import { createContext, useEffect, useReducer, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { API_ROOT } from "../ultilities/constants";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    case "UPDATE_NAME":
      const newUser = { ...state.user };
      newUser.userName = action.payload.userName;
      newUser.avatarImg = action.payload.avatarImg;
      return { user: newUser };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    // const getUserById = async (userId, token) => {
    //   const response = await fetch(`${API_ROOT}/v1/user/${userId}`, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });

    //   const json = await response.json();

    //   if (response.ok) {
    //   }

    //   if (!response.ok) {
    //     toast.error("Something went wrong! Please try again!");
    //   }
    // };
    if (data) {
      console.log("HERE");
      const user = { ...data };
      const decoded = jwtDecode(user?.token);
      user.userId = decoded._id;
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
