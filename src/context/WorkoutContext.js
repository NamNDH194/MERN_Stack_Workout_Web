import { createContext, useReducer } from "react";

export const WorkoutsContext = createContext();

export const workoutsReducer = (state, action) => {
  switch (action.type) {
    case "SET_WORKOUTS":
      return {
        workouts: action.payload,
      };
    case "CREATE_WORKOUT":
      return {
        workouts: [action.payload, ...state.workouts],
      };
    case "UPDATE_WORKOUT":
      const newWorkouts = state.workouts.map((item) => {
        if (item._id.toString() === action.payload._id.toString()) {
          item = action.payload;
        }
        return item;
      });
      return {
        workouts: newWorkouts,
      };
    case "DELETE_WORKOUT":
      const workouts = [...state.workouts];

      workouts.splice(
        workouts.findIndex(
          (item) => item._id.toString() === action.payload._id.toString()
        ),
        1
      );

      return {
        workouts: workouts,
      };
    case "LOGOUT":
      return {
        workouts: null,
      };
    default:
      return state;
  }
};

export const WorkoutsContextProvider = ({ children }) => {
  const [state, dispatchWorkoutContext] = useReducer(workoutsReducer, {
    workouts: null,
  });

  return (
    <WorkoutsContext.Provider value={{ ...state, dispatchWorkoutContext }}>
      {children}
    </WorkoutsContext.Provider>
  );
};
