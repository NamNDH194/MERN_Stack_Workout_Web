import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { API_ROOT } from "../ultilities/constants";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";
import CircularProgress from "@mui/material/CircularProgress";

const WorkoutForm = () => {
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const { dispatchWorkoutContext } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (user) {
      const workout = { title, load, reps };

      const response = await fetch(`${API_ROOT}/v1/workout`, {
        method: "POST",
        body: JSON.stringify(workout),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const json = await response.json();
      if (!response.ok) {
        toast.error(json.message);
        setIsLoading(false);
      }
      if (response.ok) {
        setError(null);
        setTitle("");
        setLoad("");
        setReps("");
        dispatchWorkoutContext({ type: "CREATE_WORKOUT", payload: json });
        toast.success("Create new workout successfully!");
        setIsLoading(false);
      }
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Excersize Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />

      <label>Load (in kg):</label>
      <input
        type="number"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
      />

      <label>Number of Reps:</label>
      <input
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
      />

      <button
        style={
          isLoading
            ? { pointerEvents: "none", width: "110px", height: "45px" }
            : { pointerEvents: "auto", width: "110px", height: "45px" }
        }
      >
        {isLoading ? (
          <CircularProgress size="18px" sx={{ color: "#fff" }} />
        ) : (
          "Add Workout"
        )}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
