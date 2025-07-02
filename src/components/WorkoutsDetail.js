import { useState } from "react";
import { toast } from "react-toastify";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { API_ROOT } from "../ultilities/constants";

// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CircularProgress from "@mui/material/CircularProgress";
import DetailsIcon from "@mui/icons-material/Details";
import Tooltip from "@mui/material/Tooltip";

import { formatDistanceToNow } from "date-fns";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutDetail = ({ workout }) => {
  const { dispatchWorkoutContext } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const menuOpen = Boolean(anchorEl);
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const date = new Date(workout.created);
  const createdDetailTime =
    (date.getHours().toString().length < 2
      ? `0${date.getHours().toString()}`
      : date.getHours().toString()) +
    ":" +
    (date.getMinutes().toString().length < 2
      ? `0${date.getMinutes().toString()}`
      : date.getMinutes().toString()) +
    "  " +
    (date.getDate().toString().length < 2
      ? `0${date.getDate().toString()}`
      : date.getDate().toString()) +
    "/" +
    (date.getMonth().toString().length < 2
      ? `0${date.getMonth() + 1}`
      : date.getMonth() + 1) +
    "/" +
    date.getFullYear();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleUpdate = async (id) => {
    setIsLoading(true);
    if (user) {
      const workout = {};
      if (title) {
        workout.title = title.toString().trim();
      }
      if (load) {
        workout.load = load.toString().trim();
      }
      if (reps) {
        workout.reps = reps.toString().trim();
      }
      if (Object.keys(workout).length <= 0) {
        toast.error("Please enter at least one field before update!");
        setIsLoading(false);
        return;
      }
      const response = await fetch(`${API_ROOT}/v1/workout/${id}`, {
        method: "PUT",
        body: JSON.stringify(workout),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.ok) {
        setTitle("");
        setLoad("");
        setReps("");
        dispatchWorkoutContext({
          type: "UPDATE_WORKOUT",
          payload: await response.json(),
        });
        setOpenModalUpdate(false);
        setAnchorEl(null);
        toast.success("Update successfully!");
        setIsLoading(false);
      } else {
        setTitle("");
        setLoad("");
        setReps("");
        toast.error("Something went wrong! Please try again!");
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    if (user) {
      const response = await fetch(`${API_ROOT}/v1/workout/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.ok) {
        setOpenModalDelete(false);
        dispatchWorkoutContext({
          type: "DELETE_WORKOUT",
          payload: await response.json(),
        });
        toast.success("Delete successfully!");
        setIsLoading(false);
      } else {
        toast.error("Something went wrong! Please try again!");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="workout-details">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4>{workout.title}</h4>
        {/* <ExpandMoreIcon className="expandMoreIcon" onClick={handleClick} /> */}
        <MoreVertIcon
          className="expandMoreIcon"
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
        />
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleCloseMenu}
          slotProps={{
            list: {
              "aria-labelledby": "basic-button",
            },
          }}
        >
          <MenuItem
            onClick={() => setOpenModalUpdate(true)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <EditNoteIcon />
            <Typography>Update</Typography>
          </MenuItem>

          <MenuItem
            onClick={() => setOpenModalDelete(true)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <DeleteForeverIcon sx={{ padding: 0 }} />
            <Typography>Delete</Typography>
          </MenuItem>
        </Menu>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openModalUpdate}
          onClose={() => setOpenModalUpdate(false)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={openModalUpdate}>
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Update Workout
              </Typography>
              <Box id="transition-modal-description" sx={{ mt: 2 }}>
                <p>Exercise title: </p>
                <input
                  placeholder={workout.title}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p>Load (in Kg): </p>
                <input
                  type="number"
                  placeholder={workout.load}
                  value={load}
                  onChange={(e) => setLoad(e.target.value)}
                />
                <p>Number of reps: </p>
                <input
                  type="number"
                  placeholder={workout.reps}
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <Button
                    onClick={() => handleUpdate(workout._id)}
                    style={
                      isLoading
                        ? {
                            pointerEvents: "none",
                          }
                        : {
                            pointerEvents: "auto",
                          }
                    }
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#10cd98",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgb(17 122 93)",
                      },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size="18px" sx={{ color: "#1aac83" }} />
                    ) : (
                      "Update"
                    )}
                  </Button>
                  <Button
                    onClick={() => setOpenModalUpdate(false)}
                    style={
                      isLoading
                        ? {
                            pointerEvents: "none",
                          }
                        : {
                            pointerEvents: "auto",
                          }
                    }
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#10cd98",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgb(17 122 93)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Modal>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openModalDelete}
          onClose={() => setOpenModalDelete(false)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={openModalDelete}>
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Delete Workout ?
              </Typography>
              <Box id="transition-modal-description" sx={{ mt: 2 }}>
                <p>
                  This action will delete all informations in this record! Are
                  you sure about this ?
                </p>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <Button
                    onClick={() => handleDelete(workout._id)}
                    style={
                      isLoading
                        ? {
                            pointerEvents: "none",
                          }
                        : {
                            pointerEvents: "auto",
                          }
                    }
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#10cd98",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgb(17 122 93)",
                      },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size="18px" sx={{ color: "#1aac83" }} />
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                  <Button
                    onClick={() => setOpenModalDelete(false)}
                    style={
                      isLoading
                        ? {
                            pointerEvents: "none",
                          }
                        : {
                            pointerEvents: "auto",
                          }
                    }
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#10cd98",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgb(17 122 93)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </div>
      <p>
        <strong>Load (kg): </strong> {workout.load}
      </p>
      <p>
        <strong>Reps: </strong> {workout.reps}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <p>
          {formatDistanceToNow(new Date(workout.created), {
            addSuffix: true,
          })}
        </p>
        <Tooltip title={`Created at ${createdDetailTime}`}>
          <DetailsIcon
            sx={{
              width: "20px",
              cursor: "pointer",
              "&.MuiSvgIcon-root:hover": {
                color: "#1aac83",
              },
            }}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default WorkoutDetail;
