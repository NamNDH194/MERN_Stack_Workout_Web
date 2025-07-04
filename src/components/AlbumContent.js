import { useEffect, useState } from "react";
import styles from "../pages/AlbumWorkoutDetails/AlbumWorkoutDetails.module.css";
import { API_ROOT } from "../ultilities/constants";
import { toast } from "react-toastify";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { useAuthContext } from "../hooks/useAuthContext";
import { useAlbumContentsContext } from "../hooks/useAlbumContentsContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import CancelIcon from "@mui/icons-material/Cancel";
import { use } from "react";

function AlbumContent({ albumContent, userId }) {
  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme }) => ({
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
    variants: [
      {
        props: ({ expand }) => !expand,
        style: {
          transform: "rotate(0deg)",
        },
      },
      {
        props: ({ expand }) => !!expand,
        style: {
          transform: "rotate(180deg)",
        },
      },
    ],
  }));

  const BUTTON_STYLES = {
    textTransform: "none",
    backgroundColor: "#10cd98",
    color: "#fff",
    "&:hover": {
      backgroundColor: "rgb(17 122 93)",
    },
  };

  const TEXTFIELD_STYLES = {
    marginTop: "20px",
    "& label": {
      color: "#000",
    },
    "& label.Mui-focused": {
      color: "#000",
    },
    "& .MuiInputBase-root": {
      "& fieldset": {
        borderColor: "#10cd98",
      },

      "&:hover fieldset": {
        borderColor: "#10cd98",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#10cd98",
      },
    },
  };

  const styleModalUpdateContent = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: "540px",
    overflowY: "auto",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const { user } = useAuthContext();
  const { dispatchAlbumContentContext } = useAlbumContentsContext();
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalUpdateExercise, setOpenModalUpdateExercise] = useState(false);
  const [albumContentName, setAlbumContentName] = useState(
    albumContent?.albumContentName
  );
  const [description, setDescription] = useState(albumContent?.description);
  const [exerciseName, setExerciseName] = useState("");
  const [setsExercise, setSetsExercise] = useState(0);
  const [repsExercise, setRepsExercise] = useState(0);
  const [timeExercise, setTimeExercise] = useState(0);
  const [detailedInstructions, setDetailedInstructions] = useState("");
  const [indexExerciseUpdate, setIndexExerciseUpdate] = useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (albumContent) {
      setAlbumContentName(albumContent?.albumContentName);
      setDescription(albumContent?.description);
    }
  }, [albumContent]);

  const handleUpdateAlbumContentInfor = async () => {
    const response = await fetch(
      `${API_ROOT}/v1/albumContent/${albumContent?._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ albumContentName, description }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    const json = await response.json();
    if (response.ok) {
      dispatchAlbumContentContext({
        type: "UPDATE_ALBUM_CONTENT",
        payload: json[0],
      });
      toast.success("Update album content infor successfully!");
    }

    if (!response.ok) {
      toast.error(json.message);
    }
    console.log(albumContentName);
    console.log(description);
    console.log(albumContent);
  };

  const handleCloseUpdateModal = () => {
    setAlbumContentName(albumContent?.albumContentName);
    setDescription(albumContent?.description);
    setOpenModalUpdate(false);
  };

  const handleUpdateExercise = () => {};

  const handleOpenModalUpdateExercise = (exercise, index) => {
    setIndexExerciseUpdate(index);
    setExerciseName(exercise.nameExercise);
    setSetsExercise(exercise.setsExercise);
    setRepsExercise(exercise.repsExercise);
    setTimeExercise(exercise.timeExercise);
    setDetailedInstructions(exercise.detailedInstructions);
    setOpenModalUpdateExercise(true);
  };

  const handleCancelUpdateExercise = () => {
    setIndexExerciseUpdate("");
    setExerciseName("");
    setSetsExercise(0);
    setRepsExercise(0);
    setTimeExercise(0);
    setDetailedInstructions("");
    setOpenModalUpdateExercise(false);
  };

  return (
    <Card
      sx={{
        width: "330px",
        height: "fit-content",
        "&:hover": {
          boxShadow: "5px 10px 18px grey",
        },
      }}
    >
      <CardHeader
        sx={{ height: "64px" }}
        action={
          userId === user?.userId ? (
            <>
              <IconButton
                aria-label="settings"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={() => setAnchorEl(null)}
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
                open={openModalUpdate}
                // onClose={() => setOpenModalUpdate(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={styleModalUpdateContent}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: "5px",
                      top: "5px",
                    }}
                  >
                    <CancelIcon
                      sx={{
                        color: "red",
                        cursor: "pointer",
                        "&:hover": {
                          color: "#f06e6e",
                        },
                        fontSize: "35px",
                      }}
                      onClick={handleCloseUpdateModal}
                    />
                  </Box>
                  <Typography
                    id="modal-modal-title"
                    variant="h4"
                    component="h2"
                    sx={{ marginTop: "20px" }}
                  >
                    Update Content
                  </Typography>

                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{
                      marginTop: "20px",
                      marginBottom: "10px",
                    }}
                  >
                    Album content infor
                  </Typography>
                  <Divider sx={{ borderTop: "1px dashed #000" }} />
                  <TextField
                    id="outlined-basic"
                    label="Album content name"
                    variant="outlined"
                    placeholder="Enter content name of album..."
                    fullWidth
                    sx={TEXTFIELD_STYLES}
                    value={albumContentName}
                    onChange={(e) => setAlbumContentName(e.target.value)}
                  />
                  <Box
                    sx={{
                      marginTop: "20px",
                      // maxHeight: "150px",
                      // overflowY: "auto",
                      marginBottom: "10px",
                    }}
                  >
                    <TextareaAutosize
                      aria-label="Detailed instructions"
                      minRows={3}
                      placeholder="Please type detailed instructions here..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={styles.detailedInstructions}
                    />
                  </Box>
                  {albumContentName !== albumContent?.albumContentName ||
                  description !== albumContent?.description ? (
                    <Button
                      sx={BUTTON_STYLES}
                      onClick={handleUpdateAlbumContentInfor}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button sx={BUTTON_STYLES} disabled>
                      Save
                    </Button>
                  )}

                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ marginTop: "20px", marginBottom: "10px" }}
                  >
                    Exercises infor
                  </Typography>
                  <Divider sx={{ borderTop: "1px dashed #000" }} />
                  <Box>
                    {albumContent?.exercises?.map((item, index) => (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                          marginBottom: "10px",
                          marginTop: "10px",
                        }}
                        key={index}
                      >
                        <Typography>
                          {index + 1}. {item?.nameExercise}
                        </Typography>
                        <Typography>
                          Sets: {item?.setsExercise} x Reps:{" "}
                          {item?.repsExercise} x Time: {item?.timeExercise}s.
                        </Typography>
                        <Typography sx={{ marginTop: "10px" }}>
                          Detailed instructions:
                        </Typography>
                        <Box
                        // sx={{
                        //   maxHeight: "150px",
                        //   overflowY: "auto",
                        // }}
                        >
                          <TextareaAutosize
                            aria-label="Detailed instructions"
                            minRows={3}
                            placeholder="Please type detailed instructions here..."
                            value={item?.detailedInstructions}
                            className={styles.detailedInstructions}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <Button
                            sx={BUTTON_STYLES}
                            startIcon={<EditNoteIcon />}
                            size="small"
                            onClick={() =>
                              handleOpenModalUpdateExercise(item, index)
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            sx={BUTTON_STYLES}
                            startIcon={<DeleteForeverIcon />}
                            size="small"
                          >
                            Remove
                          </Button>
                        </Box>
                        <Modal
                          open={openModalUpdateExercise}
                          // onClose={() => setOpenModalUpdateExercise(false)}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={styleModalUpdateContent}>
                            <Typography
                              id="modal-modal-title"
                              variant="h4"
                              component="h2"
                            >
                              Update exercise
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              label="Exercise name"
                              variant="outlined"
                              placeholder="Enter exercise name..."
                              fullWidth
                              sx={TEXTFIELD_STYLES}
                              value={exerciseName}
                              onChange={(e) => setExerciseName(e.target.value)}
                            />
                            <TextField
                              id="outlined-basic"
                              label="Sets"
                              variant="outlined"
                              placeholder="Enter sets of exercise..."
                              fullWidth
                              type="number"
                              sx={TEXTFIELD_STYLES}
                              value={setsExercise}
                              onChange={(e) =>
                                e.target.value >= 0 &&
                                setSetsExercise(e.target.value)
                              }
                            />
                            <TextField
                              id="outlined-basic"
                              label="Reps"
                              variant="outlined"
                              placeholder="Enter reps of exercise..."
                              fullWidth
                              type="number"
                              sx={TEXTFIELD_STYLES}
                              value={repsExercise}
                              onChange={(e) =>
                                e.target.value >= 0 &&
                                setRepsExercise(e.target.value)
                              }
                            />
                            <TextField
                              id="outlined-basic"
                              label="Time (Optional)"
                              variant="outlined"
                              placeholder="Enter time in seconds of exercise..."
                              fullWidth
                              type="number"
                              sx={TEXTFIELD_STYLES}
                              value={timeExercise}
                              onChange={(e) =>
                                e.target.value >= 0 &&
                                setTimeExercise(e.target.value)
                              }
                            />
                            <Typography variant="h6" sx={{ marginTop: "20px" }}>
                              Detailed instructions:
                            </Typography>
                            <Box
                              sx={{
                                maxHeight: "150px",
                                overflowY: "auto",
                                marginTop: "5px",
                              }}
                            >
                              <TextareaAutosize
                                aria-label="Detailed instructions"
                                minRows={3}
                                placeholder="Please type detailed instructions here..."
                                value={detailedInstructions}
                                onChange={(e) =>
                                  setDetailedInstructions(e.target.value)
                                }
                                className={styles.detailedInstructions}
                              />
                            </Box>
                            <Box sx={{ display: "flex", gap: "10px" }}>
                              {exerciseName !==
                                albumContent?.exercises[indexExerciseUpdate]
                                  ?.nameExercise ||
                              setsExercise.toString() !==
                                albumContent?.exercises[
                                  indexExerciseUpdate
                                ]?.setsExercise.toString() ||
                              repsExercise.toString() !==
                                albumContent?.exercises[
                                  indexExerciseUpdate
                                ]?.repsExercise.toString() ||
                              timeExercise.toString() !==
                                albumContent?.exercises[
                                  indexExerciseUpdate
                                ]?.timeExercise.toString() ||
                              detailedInstructions.toString() !==
                                albumContent?.exercises[
                                  indexExerciseUpdate
                                ]?.detailedInstructions.toString() ? (
                                <Button
                                  sx={BUTTON_STYLES}
                                  onClick={handleUpdateExercise}
                                >
                                  Save
                                </Button>
                              ) : (
                                <Button sx={BUTTON_STYLES} disabled>
                                  Save
                                </Button>
                              )}
                              <Button
                                sx={BUTTON_STYLES}
                                onClick={handleCancelUpdateExercise}
                              >
                                Cancel
                              </Button>
                            </Box>
                          </Box>
                        </Modal>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Modal>
            </>
          ) : (
            ""
          )
        }
        title={albumContent?.albumContentName}
      />

      <CardContent>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            height: "101px",
            overflowY: "auto",
          }}
        >
          {albumContent?.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button sx={BUTTON_STYLES}>Start Workout</Button>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {albumContent?.exercises?.map((item, index) => (
            <Box key={index}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                  marginBottom: "10px",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {index + 1}. {item.nameExercise}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <Typography sx={{ color: "grey" }}>
                    {item.setsExercise} sets x {item.repsExercise} reps
                    {/* {item.timeExercise ? ` x ${item.timeExercise}s` : ""} */}{" "}
                    x {item.timeExercise}s
                  </Typography>
                </Box>
              </Box>
              <Divider key={`Divider ${index}`} />
            </Box>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default AlbumContent;
