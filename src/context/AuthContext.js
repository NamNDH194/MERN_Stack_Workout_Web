import { createContext, useEffect, useReducer } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
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
    if (data) {
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
