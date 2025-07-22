import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { WorkoutsContextProvider } from "./context/WorkoutContext";
import { AuthContextProvider } from "./context/AuthContext";
import { AlbumWorkoutContextProvider } from "./context/AlbumWorkoutContext";
import { AlbumContentContextProvider } from "./context/AlbumContentContext";
import { AlbumStorageContextProvider } from "./context/AlbumStorageContext";
import { AlbumProfileContextProvider } from "./context/AlbumProfileContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AuthContextProvider>
    <AlbumWorkoutContextProvider>
      <AlbumProfileContextProvider>
        <AlbumStorageContextProvider>
          <AlbumContentContextProvider>
            <WorkoutsContextProvider>
              <App />
            </WorkoutsContextProvider>
          </AlbumContentContextProvider>
        </AlbumStorageContextProvider>
      </AlbumProfileContextProvider>
    </AlbumWorkoutContextProvider>
  </AuthContextProvider>
  // </React.StrictMode>
);
