import { AlbumWorkoutContext } from "../context/AlbumWorkoutContext";
import { useContext } from "react";

export const useAlbumWorkoutsContext = () => {
  const context = useContext(AlbumWorkoutContext);

  if (!context) {
    throw Error(
      "useAlbumWorkoutsContext must be used inside an WorkoutsContextProvider"
    );
  }

  return context;
};
