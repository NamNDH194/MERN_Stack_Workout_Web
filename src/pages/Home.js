import { useEffect, useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { API_ROOT } from "../ultilities/constants";
import { useAuthContext } from "../hooks/useAuthContext";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// components
import WorkoutDetails from "../components/WorkoutsDetail";
import WorkoutForm from "../components/WorkoutForm";
import Pagination from "@mui/material/Pagination";

import { toast } from "react-toastify";
import { sort } from "../ultilities/algorithms";

const Home = () => {
  const { workouts, dispatchWorkoutContext } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [optionSort, setOptionSort] = useState("Lastest");
  const [workoutData, setWorkoutData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch(`${API_ROOT}/v1/workout`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatchWorkoutContext({ type: "SET_WORKOUTS", payload: json });
        setIsLoading(false);
      }
      if (!response.ok) {
        toast.error("Something went wrong! Please try again!");
        setIsLoading(false);
      }
    };
    if (user) {
      setIsLoading(true);
      fetchWorkouts();
    }
    if (!user) {
      setWorkoutData([]);
    }
  }, [dispatchWorkoutContext, user]);

  useEffect(() => {
    if (workouts) {
      if (optionSort === "Lastest") {
        const test = sort([...workouts], "created", 1);
        dispatchWorkoutContext({
          type: "SET_WORKOUTS",
          payload: test,
        });
      }
      if (optionSort === "Oldest") {
        dispatchWorkoutContext({
          type: "SET_WORKOUTS",
          payload: sort([...workouts], "created", 0),
        });
      }
    }
  }, [optionSort, dispatchWorkoutContext]);

  useEffect(() => {
    if (workouts?.length > 0) {
      const tempWorkoutData = [...workouts];
      const start = (currentPage - 1) * 5;
      const end = currentPage * 5;
      setWorkoutData(tempWorkoutData.slice(start, end));
    }
    if (workouts?.length === 0) {
      setWorkoutData([]);
    }
  }, [currentPage, workouts]);

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "3fr 1fr",
            gap: "100px",
          }}
        >
          <Box>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Box>
          <Box>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Box>
        </Box>
      ) : (
        <div className="home">
          <div style={{ display: "flex", flexDirection: "column" }}>
            {workouts?.length > 0 ? (
              <Box sx={{ width: "175px" }}>
                <FormControl
                  variant="outlined"
                  sx={{
                    "& label": {
                      color: "#000",
                    },
                    "& label.Mui-focused": {
                      color: "#000",
                    },
                  }}
                  fullWidth
                >
                  <InputLabel id="demo-simple-select-label">
                    Option sorting
                  </InputLabel>
                  <Select
                    sx={{
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "#10cd98",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#10cd98",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#10cd98",
                      },
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={optionSort === "Lastest" ? "Lastest" : "Oldest"}
                    label="Option sorting"
                    onChange={(e) => setOptionSort(e.target.value)}
                  >
                    <MenuItem value="Lastest">Latest</MenuItem>
                    <MenuItem value="Oldest">Oldest</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            ) : (
              ""
            )}
            <div className="workouts">
              {workoutData?.length > 0 ? (
                workoutData?.map((workout) => (
                  <WorkoutDetails workout={workout} key={workout?._id} />
                ))
              ) : (
                <p>You have not made any notes about workout exercise yet.</p>
              )}
            </div>
            {/* {workouts?.length > 0 ? (
              <Pagination
                count={Math.ceil(workouts?.length / 5)}
                variant="outlined"
                shape="rounded"
                sx={{ marginX: "auto" }}
                onClick={(e) => setCurrentPage(Number(e.target.innerText))}
              />
            ) : (
              ""
            )} */}
          </div>
          <WorkoutForm />
        </div>
      )}
      {workouts?.length > 0 ? (
        <Pagination
          count={Math.ceil(workouts?.length / 5)}
          variant="outlined"
          shape="rounded"
          sx={{ marginX: "auto", maxWidth: "fit-content" }}
          onChange={(e, page) => {
            setCurrentPage(page);
          }}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Home;
