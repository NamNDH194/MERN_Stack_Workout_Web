import { AlbumStorageContext } from "../context/AlbumStorageContext";
import { useContext } from "react";

export const useAlbumStoragesContext = () => {
  const context = useContext(AlbumStorageContext);

  if (!context) {
    throw Error(
      "useAlbumStoragesContext must be used inside an AlbumStoragesContextProvider"
    );
  }

  return context;
};
