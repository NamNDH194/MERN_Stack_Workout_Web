import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Appbar from "../components/Appbar/Appbar";
import { useAuthContext } from "../hooks/useAuthContext";
import AlbumWorkout from "./AlbumWorkout/AlbumWorkout";
import Storage from "./Storage";
import Home from "./Home";
import Auth from "./Auth";
import Page404 from "./Page404";
import AlbumWorkoutDetails from "./AlbumWorkoutDetails/AlbumWorkoutDetails";
import StartWorkout from "./StartWorkout";

function InnerRoutes() {
  const { user } = useAuthContext();
  const location = useLocation();

  const albumWorkoutDetailsPage = /^\/album_workouts_detail\/[^/]+$/.test(
    location.pathname
  );

  const startWorkoutPage = /^\/start_workout\/[^/]+$/.test(location.pathname);

  const page404 = /^\/404\/?$/.test(location.pathname);

  const knownPatterns = [
    /^\/$/,
    /^\/login\/?$/,
    /^\/storage\/?$/,
    /^\/public_album_workouts\/?$/,
    /^\/album_workouts_detail\/[^/]+\/?$/,
    /^\/start_workout\/[^/]+\/?$/,
    /^\/404\/?$/,
  ];

  const belongsToApp = knownPatterns.some((regex) =>
    regex.test(location.pathname)
  );

  if (!belongsToApp) {
    window.location.href = "/404";
  }

  if (localStorage.getItem("user") && location.pathname === "/login") {
    window.location.href = "/";
  }

  if (!localStorage.getItem("user") && location.pathname !== "/login") {
    window.location.href = "/login";
  }

  if (
    !localStorage.getItem("user") &&
    albumWorkoutDetailsPage &&
    startWorkoutPage
  ) {
    window.location.href = "/login";
  }

  return (
    <>
      {/* {!albumWorkoutDetailsPage && !startWorkoutPage && !page404 ? (
        <Navbar />
      ) : (
        ""
      )} */}
      <Navbar />

      {user && !albumWorkoutDetailsPage && !startWorkoutPage && !page404 ? (
        <Appbar />
      ) : (
        ""
      )}

      {!page404 ? (
        <div className="pages">
          {user ? (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/public_album_workouts" element={<AlbumWorkout />} />
              <Route path="/storage" element={<Storage />} />
              <Route
                path="/album_workouts_detail/:id"
                element={<AlbumWorkoutDetails />}
              />
              <Route path="/start_workout/:id" element={<StartWorkout />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/login" element={<Auth />} />
            </Routes>
          )}
        </div>
      ) : (
        ""
      )}
      <Routes>
        <Route path="/404" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default InnerRoutes;
