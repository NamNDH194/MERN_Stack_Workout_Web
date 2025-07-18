import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";
import styles from "../pages/AlbumWorkoutDetails/AlbumWorkoutDetails.module.css";
import { API_ROOT } from "../ultilities/constants";
import styleStartWorkout from "./StartWorkout.module.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import HelpIcon from "@mui/icons-material/Help";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import StopWatch from "../components/StopWatch/StopWatch";

function StartWorkout() {
  const navigate = useNavigate();
  const { albumContentId } = useParams();
  const location = useLocation();
  const { user } = useAuthContext();
  const [allowWorkout, setAllowWorkout] = useState(false);
  const [albumContent, setAlbumContent] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [openModalDetailedIns, setOpenModalDetailedIns] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [currentNameExInModal, setCurrentNameExInModal] = useState("");
  const [currentDetailInsModal, setCurrentDetailInsModal] = useState("");
  const [currentExercise, setCurrentExercise] = useState(0);
  const [markDone, setMarkDone] = useState(false);
  const [openModalSkip, setOpenModalSkip] = useState(false);
  const [openModalMarkDone, setOpenModalMarkDone] = useState(false);
  const [setsExercise, setSetsExercise] = useState(0);
  const [repsExercise, setRepsExercise] = useState(0);
  const [isDisabledMarkDoneBtn, setIsDisabledMarkDoneBtn] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const resultExercisesRef = useRef([]);

  const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 410,
    maxHeight: "350px",
    overflowY: "auto",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const BUTTON_STYLES = {
    // textTransform: "none",
    backgroundColor: "#10cd98",
    color: "#fff",
    "&:hover": {
      backgroundColor: "rgb(17 122 93)",
    },
  };

  const BUTTON_STYLES_DIRECTION = {
    // textTransform: "none",
    backgroundColor: "#ff",
    color: "#000",
    fontWeight: "600",
    "&:hover": {
      backgroundColor: "#dbd7d7",
    },
  };

  const BUTTON_STYLES_MODAL = {
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

  useEffect(() => {
    if (location.state) {
      setAlbumContent(location.state);
    }
  }, [location]);

  useEffect(() => {
    const fetchAlbumWorkout = async () => {
      const response = await fetch(
        `${API_ROOT}/v1/albumWorkout/${albumContent?.albumWorkoutId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const json = await response.json();

      if (response.ok) {
        if (json?.status === "Public") {
          setAllowWorkout(true);
        }
        if (json?.status === "Private") {
          if (user?.userId === json?.userId) {
            setAllowWorkout(true);
          }
        }
        setIsLoading(false);
      }

      if (!response.ok) {
        toast.error("Something went wrong! Please try again!");
        setIsLoading(false);
      }
    };

    if (user && albumContent) {
      setIsLoading(true);
      fetchAlbumWorkout();
    }
  }, [albumContent, user, albumContentId]);

  const TruncatedText = ({ text, lines = 3 }) => {
    const [expanded, setExpanded] = useState(false);

    const [showReadMore, setShowReadMore] = useState(false);
    const ref = useRef();

    useEffect(() => {
      const el = ref.current;
      if (el && el.scrollHeight > el.clientHeight) {
        setShowReadMore(true);
      }
    }, []);

    return (
      <Box>
        <Typography
          ref={ref}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: expanded ? "unset" : lines,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {text}
        </Typography>
        {showReadMore && (
          <Typography
            onClick={() => setExpanded(!expanded)}
            sx={{
              color: "#1aac83",
              cursor: "pointer",
              "&:hover": {
                color: "#138364",
              },
            }}
          >
            {expanded ? "Read less" : "Read more"}
          </Typography>
        )}
      </Box>
    );
  };

  const handleOpenDetailedInsModal = (exercise) => {
    setCurrentDetailInsModal(exercise?.detailedInstructions);
    setCurrentNameExInModal(exercise?.nameExercise);
    setOpenModalDetailedIns(true);
  };

  const handleCloseDetailedInsModal = () => {
    setCurrentDetailInsModal("");
    setOpenModalDetailedIns(false);
  };

  const handleStartWorkout = () => {
    if (albumContent?.exercises?.length > 0) {
      setIsStart(true);
    } else {
      toast.error(
        "This content doesn't have any exercises yet! Please come back later!"
      );
    }
  };

  const handleGoPreviousExercise = () => {
    setCurrentExercise(currentExercise - 1);
    setIsReset(true);
  };

  const handleGoNextExercise = () => {
    if (!resultExercisesRef.current[currentExercise]) {
      toast.error(
        "Please complete the current exercise before going to the next one!"
      );
    } else {
      setIsReset(true);
      setCurrentExercise(currentExercise + 1);
    }
  };

  const handleSkipExercise = () => {
    if (currentExercise < albumContent?.exercises?.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
    resultExercisesRef.current = [
      ...resultExercisesRef.current,
      {
        exerciseName: albumContent?.exercises[currentExercise]?.nameExercise,
        setsExerciseWorkout:
          albumContent?.exercises[currentExercise]?.setsExercise,
        repsExerciseWorkout:
          albumContent?.exercises[currentExercise]?.repsExercise,
        timeExerciseWorkout:
          albumContent?.exercises[currentExercise]?.timeExercise,
        status: "Skip",
      },
    ];
    if (resultExercisesRef.current.length === albumContent?.exercises?.length) {
      setShowResult(true);
    }
    setIsReset(true);
    setOpenModalSkip(false);
  };

  const handleMarkAsDone = () => {
    setMarkDone(true);
    setOpenModalMarkDone(false);
  };

  const handleGetElapsedTime = (elapsedTime) => {
    let sets = setsExercise;
    let reps = repsExercise;

    if (
      setsExercise.toString().length > 1 &&
      setsExercise.toString()[0] === "0"
    ) {
      sets = setsExercise.toString().slice(1);
      sets = +sets;
    }

    if (
      repsExercise.toString().length > 1 &&
      repsExercise.toString()[0] === "0"
    ) {
      reps = repsExercise.toString().slice(1);
      reps = +reps;
    }
    resultExercisesRef.current = [
      ...resultExercisesRef.current,
      {
        exerciseName: albumContent?.exercises[currentExercise]?.nameExercise,
        setsExerciseUser: sets,
        repsExerciseUser: reps,
        timeExerciseUser: elapsedTime,
        setsExerciseWorkout:
          albumContent?.exercises[currentExercise]?.setsExercise,
        repsExerciseWorkout:
          albumContent?.exercises[currentExercise]?.repsExercise,
        timeExerciseWorkout:
          albumContent?.exercises[currentExercise]?.timeExercise,
        status: "Done",
      },
    ];
    setSetsExercise(0);
    setRepsExercise(0);
    if (resultExercisesRef.current.length === albumContent?.exercises?.length) {
      setShowResult(true);
    }
    setMarkDone(false);
  };

  const handleCancelMarkDone = () => {
    setOpenModalMarkDone(false);
    setSetsExercise(0);
    setRepsExercise(0);
  };

  useEffect(() => {
    resultExercisesRef.current[currentExercise]
      ? setIsDisabledMarkDoneBtn(true)
      : setIsDisabledMarkDoneBtn(false);
  }, [currentExercise, markDone]);

  useEffect(() => {
    setIsReset(false);
  }, [currentExercise]);

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            width: "fit-content",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress />
        </Box>
      ) : allowWorkout ? (
        <>
          <ArrowBackIcon
            sx={{
              fontSize: "50px",
              color: "#10cd98",
              cursor: "pointer",
              border: "1px solid #10cd98",
              borderRadius: "50%",
              transition: "scale 0.5s ease",
              "&:hover": {
                color: "rgb(17 122 93)",
                borderColor: "rgb(17 122 93)",
                scale: "1.1",
              },
            }}
            onClick={() => {
              navigate(
                `/album_workouts_detail/${albumContent?.albumWorkoutId}`
              );
            }}
          />

          {isStart && albumContent?.exercises?.length > 0 ? (
            showResult ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                  position: "absolute",
                  top: "10%",
                  left: "50%",
                  transform: "translate(-50%)",
                }}
              >
                <Box>
                  <Typography variant="h3">Workout Complete</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: "30px" }}>
                  <Box
                    sx={{ display: "flex", gap: "10px", alignItems: "center" }}
                  >
                    <div className={styleStartWorkout.squareGreen}></div>
                    <Typography>Pass</Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", gap: "10px", alignItems: "center" }}
                  >
                    <div className={styleStartWorkout.squareRed}></div>
                    <Typography>Not Pass</Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", gap: "10px", alignItems: "center" }}
                  >
                    <div className={styleStartWorkout.squareBlue}></div>
                    <Typography>Target</Typography>
                  </Box>
                </Box>
                <table className={styleStartWorkout.tableResult}>
                  <thead className={styleStartWorkout.theadResult}>
                    <tr className={styleStartWorkout.trResult}>
                      <th className={styleStartWorkout.thResult}>
                        Exercise name
                      </th>
                      <th className={styleStartWorkout.thResult}>Your sets</th>
                      <th className={styleStartWorkout.thResult}>Your reps</th>
                      <th className={styleStartWorkout.thResult}>
                        Required sets to complete
                      </th>
                      <th className={styleStartWorkout.thResult}>
                        Required reps to complete
                      </th>
                      <th className={styleStartWorkout.thResult}>Time</th>
                      <th className={styleStartWorkout.thResult}>Status</th>
                    </tr>
                  </thead>
                  <tbody className={styleStartWorkout.tbodyResult}>
                    {resultExercisesRef.current.map((item) => {
                      return (
                        <tr className={styleStartWorkout.trResult}>
                          <td className={styleStartWorkout.tdResult}>
                            {item.exerciseName}
                          </td>
                          <td
                            className={styleStartWorkout.tdResult}
                            style={{
                              color:
                                item.setsExerciseUser >=
                                item.setsExerciseWorkout
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {item.setsExerciseUser ||
                            Number(item.setsExerciseUser) === 0 ? (
                              item.setsExerciseUser
                            ) : (
                              <CloseIcon sx={{ color: "red" }} />
                            )}
                          </td>
                          <td
                            className={styleStartWorkout.tdResult}
                            style={{
                              color:
                                item.repsExerciseUser >=
                                item.repsExerciseWorkout
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {item.repsExerciseUser ||
                            Number(item.repsExerciseUser) === 0 ? (
                              item.repsExerciseUser
                            ) : (
                              <CloseIcon sx={{ color: "red" }} />
                            )}
                          </td>
                          <td
                            className={styleStartWorkout.tdResult}
                            style={{ color: "blue" }}
                          >
                            {item.setsExerciseWorkout}
                          </td>
                          <td
                            className={styleStartWorkout.tdResult}
                            style={{ color: "blue" }}
                          >
                            {item.repsExerciseWorkout}
                          </td>
                          <td className={styleStartWorkout.tdResult}>
                            {item.timeExerciseUser ? (
                              item.timeExerciseUser
                            ) : (
                              <CloseIcon sx={{ color: "red" }} />
                            )}
                          </td>
                          <td
                            className={styleStartWorkout.tdResult}
                            style={{
                              color:
                                item.status.toLocaleUpperCase() === "DONE"
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {item.status}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px",
                    width: "100%",
                  }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/left_arm.png`}
                    alt="gym_image"
                    style={{ width: "100px", height: "100px" }}
                  />
                  <Typography sx={{ textAlign: "center", color: "green" }}>
                    IT NEVER GETS EASIER, YOU JUST GET STRONGER
                  </Typography>
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/right_arm.png`}
                    alt="gym_image"
                    style={{ width: "100px", height: "100px" }}
                  />
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "absolute",
                  top: "10%",
                  left: "50%",
                  transform: "translate(-50%)",
                }}
              >
                <Box
                  sx={{
                    width: "230px",
                    padding: "20px",
                    borderRadius: "10px",
                    backgroundColor: "#dbd7d7",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Typography variant="h5">{`EXERCISE ${
                    currentExercise + 1
                  } OF ${albumContent?.exercises?.length}`}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="h3"
                    sx={{ textTransform: "uppercase", fontWeight: "700" }}
                  >
                    {albumContent?.exercises[currentExercise]?.nameExercise}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    marginTop: "10px",
                    maxWidth: "500px",
                    backgroundColor: "#fff",
                    padding: "40px",
                    borderRadius: "20px",
                  }}
                >
                  <StopWatch
                    markDone={markDone}
                    handleGetElapsedTime={handleGetElapsedTime}
                    isReset={isReset}
                  />
                  <Box>
                    <Typography>
                      <TruncatedText
                        text={
                          albumContent?.exercises[currentExercise]
                            ?.detailedInstructions
                        }
                      />
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "#fff",
                    alignItems: "center",
                    marginTop: "20px",
                    paddingY: "10px",
                    borderRadius: "20px",
                  }}
                >
                  <Typography
                    sx={{ marginLeft: "20px" }}
                  >{`SETS: ${albumContent?.exercises[currentExercise]?.setsExercise}`}</Typography>
                  <Typography>{`REPS: ${albumContent?.exercises[currentExercise]?.repsExercise}`}</Typography>
                  <Typography
                    sx={{ marginRight: "20px" }}
                  >{`TIME: ${albumContent?.exercises[currentExercise]?.timeExercise}s`}</Typography>
                </Box>

                <Box sx={{ marginTop: "20px" }}>
                  <Button
                    sx={BUTTON_STYLES}
                    onClick={() => setOpenModalMarkDone(true)}
                    disabled={isDisabledMarkDoneBtn}
                  >
                    MARK AS DONE
                  </Button>
                  <Modal
                    open={openModalMarkDone}
                    onClose={handleCancelMarkDone}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={styleModal}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        Please enter complete information below before go to the
                        next exercise! How many sets and reps could you do in
                        this exercise ?
                      </Typography>
                      <TextField
                        id="outlined-basic"
                        label="Sets"
                        variant="outlined"
                        placeholder="Enter number of sets..."
                        type="number"
                        fullWidth
                        sx={TEXTFIELD_STYLES}
                        value={setsExercise}
                        onChange={(e) =>
                          e.target.value >= 0 && setSetsExercise(e.target.value)
                        }
                      />
                      <TextField
                        id="outlined-basic"
                        label="Reps"
                        variant="outlined"
                        placeholder="Enter number of reps..."
                        type="number"
                        fullWidth
                        sx={TEXTFIELD_STYLES}
                        value={repsExercise}
                        onChange={(e) =>
                          e.target.value >= 0 && setRepsExercise(e.target.value)
                        }
                      />

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginTop: "20px",
                          width: "fit-content",
                          position: "relative",
                          left: "calc(100% - 160px)",
                        }}
                      >
                        <Button
                          sx={BUTTON_STYLES_MODAL}
                          onClick={handleMarkAsDone}
                        >
                          Confirm
                        </Button>
                        <Button
                          sx={BUTTON_STYLES_MODAL}
                          onClick={handleCancelMarkDone}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Modal>
                </Box>
                <Box
                  sx={{
                    marginTop: "20px",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Button
                    sx={BUTTON_STYLES_DIRECTION}
                    disabled={currentExercise === 0 ? true : false}
                    onClick={handleGoPreviousExercise}
                  >
                    PREVIOUS
                  </Button>
                  <Button
                    sx={BUTTON_STYLES_DIRECTION}
                    disabled={
                      currentExercise === albumContent?.exercises?.length - 1
                        ? true
                        : false
                    }
                    onClick={handleGoNextExercise}
                  >
                    NEXT
                  </Button>
                  <Button
                    sx={BUTTON_STYLES_DIRECTION}
                    disabled={
                      // currentExercise === albumContent?.exercises?.length - 1 ||
                      isDisabledMarkDoneBtn ? true : false
                    }
                    onClick={() => setOpenModalSkip(true)}
                  >
                    SKIP
                  </Button>
                  <Modal
                    open={openModalSkip}
                    onClose={() => setOpenModalSkip(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={styleModal}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        Skip exercise ?
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to skip this exercise?
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginTop: "20px",
                          width: "fit-content",
                          position: "relative",
                          left: "calc(100% - 160px)",
                        }}
                      >
                        <Button
                          sx={BUTTON_STYLES_MODAL}
                          onClick={handleSkipExercise}
                        >
                          Confirm
                        </Button>
                        <Button
                          sx={BUTTON_STYLES_MODAL}
                          onClick={() => setOpenModalSkip(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Modal>
                </Box>
              </Box>
            )
          ) : (
            <Box
              sx={{
                width: "50%",
                position: "absolute",
                top: "20%",
                left: "50%",
                transform: "translate(-50%)",
                border: "2px solid #10cd98",
                padding: "40px",
                borderRadius: "10px",
                backgroundColor: "#fff",
                boxShadow: "5px 10px 20px rgba(0, 0, 0, 0.35)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <Box>
                  <Typography variant="h3" sx={{ marginBottom: "15px" }}>
                    {albumContent?.albumContentName}
                  </Typography>
                  <TruncatedText text={albumContent?.description} />
                </Box>
                <Divider sx={{ borderTop: "1px dashed #000 " }} />
                <Box>
                  <Typography variant="h5">
                    {albumContent?.exercises?.length > 1
                      ? `${albumContent?.exercises?.length} Exercises`
                      : `${albumContent?.exercises?.length} Exercise`}
                  </Typography>
                  <ul>
                    {albumContent?.exercises?.length > 0
                      ? albumContent?.exercises?.map((exercise) => (
                          <li>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              {exercise?.nameExercise}
                              <Tooltip title="Exercise detailed instructions">
                                <HelpIcon
                                  sx={{
                                    fontSize: "20px",
                                    color: "#10cd98",
                                    cursor: "pointer",
                                    "&:hover": {
                                      color: "#1aac83",
                                    },
                                  }}
                                  onClick={() =>
                                    handleOpenDetailedInsModal(exercise)
                                  }
                                />
                              </Tooltip>

                              <Modal
                                open={openModalDetailedIns}
                                onClose={handleCloseDetailedInsModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                              >
                                <Box sx={styleModal}>
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h5"
                                    component="h2"
                                  >
                                    {`Detailed instruction for ${currentNameExInModal} exercise`}
                                  </Typography>
                                  {/* <Typography
                                    id="modal-modal-description"
                                    sx={{ mt: 2 }}
                                    variant="body1"
                                  >
                                    {currentDetailInsModal}
                                  </Typography> */}
                                  <TextareaAutosize
                                    aria-label="Detailed instructions"
                                    minRows={3}
                                    placeholder="Please type detailed instructions here..."
                                    value={currentDetailInsModal}
                                    readOnly
                                    style={{
                                      marginTop: "20px",
                                      padding: "10px",
                                    }}
                                    className={styles.detailedInstructions}
                                  />
                                </Box>
                              </Modal>
                            </Box>
                          </li>
                        ))
                      : ""}
                  </ul>
                </Box>
                <Box
                  sx={{
                    width: "fit-content",
                    margin: "auto",
                  }}
                >
                  <Button
                    sx={{
                      width: "100px",
                      height: "50px",
                      textTransform: "none",
                      backgroundColor: "#10cd98",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgb(17 122 93)",
                      },
                    }}
                    onClick={handleStartWorkout}
                  >
                    Start Now
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Box
          sx={{
            width: "fit-content",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/error_image.png`}
            alt="error_image"
          />
          <Typography sx={{ marginTop: "20px", textAlign: "center" }}>
            An unexpected error has occurred. Please try again!
          </Typography>
        </Box>
      )}
    </>
  );
}

export default StartWorkout;
