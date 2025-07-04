import { AlbumContentContext } from "../context/AlbumContentContext";
import { useContext } from "react";

export const useAlbumContentsContext = () => {
  const context = useContext(AlbumContentContext);

  if (!context) {
    throw Error(
      "useAlbumContentsContext must be used inside an WorkoutsContextProvider"
    );
  }

  return context;
};
