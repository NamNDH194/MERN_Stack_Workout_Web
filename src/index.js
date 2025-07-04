import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { WorkoutsContextProvider } from "./context/WorkoutContext";
import { AuthContextProvider } from "./context/AuthContext";
import { AlbumWorkoutContextProvider } from "./context/AlbumWorkoutContext";
import { AlbumContentContextProvider } from "./context/AlbumContentContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AuthContextProvider>
    <AlbumWorkoutContextProvider>
      <AlbumContentContextProvider>
        <WorkoutsContextProvider>
          <App />
        </WorkoutsContextProvider>
      </AlbumContentContextProvider>
    </AlbumWorkoutContextProvider>
  </AuthContextProvider>
  // </React.StrictMode>
);
