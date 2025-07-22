import { createContext, useReducer } from "react";

export const AlbumProfileContext = createContext();

export const albumProfilesReducer = (state, action) => {
  switch (action.type) {
    case "SET_ALBUM_PROFILE":
      return {
        albumProfiles: action.payload,
      };
    case "CREATE_ALBUM_PROFILE":
      return {
        albumProfiles: [action.payload, ...state.albumProfiles],
      };
    case "UPDATE_ALBUM_PROFILE":
      const newAlbumProfiles = state?.albumProfiles?.map((item) => {
        if (item?._id?.toString() === action?.payload?._id?.toString()) {
          item = action?.payload;
        }
        return item;
      });
      return {
        albumProfiles: newAlbumProfiles,
      };
    case "DELETE_ALBUM_PROFILE":
      const albumProfiles = [...state?.albumProfiles];
      albumProfiles?.splice(
        albumProfiles?.findIndex(
          (item) => item?._id?.toString() === action?.payload?._id?.toString()
        ),
        1
      );
      return {
        albumProfiles: albumProfiles,
      };
    case "LOGOUT":
      return {
        albumProfiles: null,
      };
    default:
      return state;
  }
};

export const AlbumProfileContextProvider = ({ children }) => {
  const [state, dispatchAlbumProfileContext] = useReducer(
    albumProfilesReducer,
    {
      albumProfiles: null,
    }
  );

  return (
    <AlbumProfileContext.Provider
      value={{ ...state, dispatchAlbumProfileContext }}
    >
      {children}
    </AlbumProfileContext.Provider>
  );
};
