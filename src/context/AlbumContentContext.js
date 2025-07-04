import { createContext, useReducer } from "react";

export const AlbumContentContext = createContext();

export const albumContentReducer = (state, action) => {
  switch (action.type) {
    case "SET_ALBUM_CONTENT":
      return {
        albumContents: action.payload,
      };
    case "CREATE_ALBUM_CONTENT":
      return {
        albumContents: [action.payload, ...state.albumContents],
      };
    case "UPDATE_ALBUM_CONTENT":
      const newAlbumContents = state.albumContents.map((item) => {
        if (item._id.toString() === action.payload._id.toString()) {
          item = action.payload;
        }
        return item;
      });
      return {
        albumContents: newAlbumContents,
      };
    case "DELETE_CONTENT":
      const albumContents = [...state.albumContents];
      albumContents.splice(
        albumContents.findIndex(
          (item) => item._id.toString() === action.payload._id.toString()
        ),
        1
      );
      return {
        albumContents: albumContents,
      };
    case "LOGOUT":
      return {
        albumContents: null,
      };
    default:
      return state;
  }
};

export const AlbumContentContextProvider = ({ children }) => {
  const [state, dispatchAlbumContentContext] = useReducer(albumContentReducer, {
    albumContents: null,
  });

  return (
    <AlbumContentContext.Provider
      value={{ ...state, dispatchAlbumContentContext }}
    >
      {children}
    </AlbumContentContext.Provider>
  );
};
