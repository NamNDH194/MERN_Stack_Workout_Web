import { AlbumProfileContext } from "../context/AlbumProfileContext";
import { useContext } from "react";

export const useAlbumProfilesContext = () => {
  const context = useContext(AlbumProfileContext);

  if (!context) {
    throw Error(
      "useAlbumProfilesContext must be used inside an AlbumProfilesContextProvider"
    );
  }

  return context;
};
