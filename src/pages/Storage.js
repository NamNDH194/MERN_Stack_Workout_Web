import React, { useEffect, useState } from "react";
import { useAlbumStoragesContext } from "../hooks/useAlbumStoragesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { API_ROOT } from "../ultilities/constants";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import AlbumWorkoutContent from "../components/AlbumWorkoutContent";
import { useAlbumWorkoutsContext } from "../hooks/useAlbumWorkoutsContext";

function Storage() {
  const { albumStorages, dispatchAlbumStorageContext } =
    useAlbumStoragesContext();
  const { user } = useAuthContext();
  const { dispatchAlbumWorkoutContext } = useAlbumWorkoutsContext();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAlbumWorkouts = async () => {
      const response = await fetch(`${API_ROOT}/v1/albumWorkout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatchAlbumWorkoutContext({
          type: "SET_ALBUM_WORKOUTS",
          payload: json,
        });
      }
      if (!response.ok) {
        toast.error("Something went wrong! Please reload page!");
      }
    };
    if (user) {
      fetchAlbumWorkouts();
    } else {
      toast.error("Something went wrong! Please try again!");
    }
  }, [user, dispatchAlbumWorkoutContext]);

  useEffect(() => {
    const fetchAlbumStorages = async () => {
      const response = await fetch(`${API_ROOT}/v1/albumStorage/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatchAlbumStorageContext({
          type: "SET_ALBUM_STORAGE",
          payload: json,
        });
        setIsLoading(false);
      }

      if (!response.ok) {
        toast.error("Something went wrong! Please try again!");
        setIsLoading(false);
      }
    };

    if (user) {
      setIsLoading(true);
      fetchAlbumStorages();
    } else {
      toast.error("Something went wrong! Please try again!");
    }
  }, [dispatchAlbumStorageContext, user]);

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <Box sx={{ width: "330px", height: "fit-content" }}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Box>
          <Box sx={{ width: "330px", height: "fit-content" }}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Box>
          <Box sx={{ width: "330px", height: "fit-content" }}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Box>
          <Box sx={{ width: "330px", height: "fit-content" }}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Box>
        </Box>
      ) : (
        <>
          {albumStorages?.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {albumStorages?.map((albumWorkout) => (
                <AlbumWorkoutContent
                  albumWorkout={albumWorkout}
                  key={albumWorkout?._id}
                />
              ))}
            </Box>
          ) : (
            "You haven't saved any albums yet, or the albums have been set to private."
          )}
        </>
      )}
    </>
  );
}

export default Storage;
