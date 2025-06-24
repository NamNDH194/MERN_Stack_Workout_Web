import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { WorkoutsContextProvider } from "./context/WorkoutContext";
import { AuthContextProvider } from "./context/AuthContext";
import { AlbumWorkoutContextProvider } from "./context/AlbumWorkoutContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AuthContextProvider>
    <AlbumWorkoutContextProvider>
      <WorkoutsContextProvider>
        <App />
      </WorkoutsContextProvider>
    </AlbumWorkoutContextProvider>
  </AuthContextProvider>
  // </React.StrictMode>
);
