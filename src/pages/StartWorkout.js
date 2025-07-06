import React, { useEffect } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAlbumContentsContext } from "../hooks/useAlbumContentsContext";
import { API_ROOT } from "../ultilities/constants";

function StartWorkout() {
  const navigate = useNavigate();
  const { albumContentId } = useParams();
  const location = useLocation();
  const albumWorkoutId = location.state;

  //   useEffect(() => {
  //     const fetchAlbumWorkout = async () => {
  //         const response = await fetch(`${API_ROOT}`)
  //     }
  //   }, [albumWorkoutId]);

  return (
    <>
      <ArrowBackIcon
        sx={{
          fontSize: "50px",
          color: "#10cd98",
          cursor: "pointer",
          "&:hover": {
            color: "rgb(17 122 93)",
          },
        }}
        onClick={() => navigate(`/album_workouts_detail/${albumWorkoutId}`)}
      />
      <h1>Start workout</h1>
    </>
  );
}

export default StartWorkout;
