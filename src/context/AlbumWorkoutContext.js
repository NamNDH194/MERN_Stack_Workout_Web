import { createContext, useReducer } from "react";

export const AlbumWorkoutContext = createContext();

export const albumWorkoutsReducer = (state, action) => {
  switch (action.type) {
    case "SET_ALBUM_WORKOUTS":
      return {
        albumWorkouts: action.payload,
      };
    case "CREATE_ALBUM_WORKOUT":
      return {
        albumWorkouts: [action.payload, ...state.albumWorkouts],
      };
    case "UPDATE_ALBUM_WORKOUT":
      const newAlbumWorkouts = state.albumWorkouts.map((item) => {
        if (item._id.toString() === action.payload._id.toString()) {
          item = action.payload;
        }
        return item;
      });
      return {
        albumWorkouts: newAlbumWorkouts,
      };
    case "DELETE_WORKOUT":
      const albumWorkouts = [...state.albumWorkouts];
      albumWorkouts.splice(
        albumWorkouts.findIndex(
          (item) => item._id.toString() === action.payload._id.toString()
        ),
        1
      );
      return {
        albumWorkouts: albumWorkouts,
      };
    case "LOGOUT":
      return {
        albumWorkouts: null,
      };
    default:
      return state;
  }
};

export const AlbumWorkoutContextProvider = ({ children }) => {
  const [state, dispatchAlbumWorkoutContext] = useReducer(
    albumWorkoutsReducer,
    {
      albumWorkouts: null,
    }
  );

  return (
    <AlbumWorkoutContext.Provider
      value={{ ...state, dispatchAlbumWorkoutContext }}
    >
      {children}
    </AlbumWorkoutContext.Provider>
  );
};
