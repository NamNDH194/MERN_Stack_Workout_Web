import { createContext, useReducer } from "react";

export const AlbumStorageContext = createContext();

export const albumStoragesReducer = (state, action) => {
  switch (action.type) {
    case "SET_ALBUM_STORAGE":
      return {
        albumStorages: action.payload,
      };
    case "CREATE_ALBUM_STORAGE":
      return {
        albumStorages: [action.payload, ...state.albumStorages],
      };
    case "UPDATE_ALBUM_STORAGE":
      const newAlbumStorages = state.albumStorages.map((item) => {
        if (item._id.toString() === action.payload._id.toString()) {
          item = action.payload;
        }
        return item;
      });
      return {
        albumStorages: newAlbumStorages,
      };
    case "DELETE_STORAGE":
      const albumStorages = [...state.albumStorages];
      albumStorages.splice(
        albumStorages.findIndex(
          (item) => item._id.toString() === action.payload._id.toString()
        ),
        1
      );
      return {
        albumStorages: albumStorages,
      };
    case "LOGOUT":
      return {
        albumStorages: null,
      };
    default:
      return state;
  }
};

export const AlbumStorageContextProvider = ({ children }) => {
  const [state, dispatchAlbumStorageContext] = useReducer(
    albumStoragesReducer,
    {
      albumStorages: null,
    }
  );

  return (
    <AlbumStorageContext.Provider
      value={{ ...state, dispatchAlbumStorageContext }}
    >
      {children}
    </AlbumStorageContext.Provider>
  );
};
