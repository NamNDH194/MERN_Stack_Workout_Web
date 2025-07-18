import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../ultilities/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useAlbumWorkoutsContext } from "../../hooks/useAlbumWorkoutsContext";
import { toast } from "react-toastify";
import styles from "./AlbumWorkoutDetails.module.css";
import { isEmpty } from "lodash";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArticleIcon from "@mui/icons-material/Article";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import Chip from "@mui/material/Chip";
import CancelIcon from "@mui/icons-material/Cancel";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import TextareaAutosize from "@mui/material/TextareaAutosize";

import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import DOMPurify from "dompurify";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useAlbumContentsContext } from "../../hooks/useAlbumContentsContext";
import AlbumContent from "../../components/AlbumContent";

function AlbumWorkoutDetails() {
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

  const BUTTON_STYLES = {
    textTransform: "none",
    backgroundColor: "#10cd98",
    color: "#fff",
    "&:hover": {
      backgroundColor: "rgb(17 122 93)",
    },
  };

  const styleCreateContentModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    maxHeight: "590px",
    p: 4,
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { dispatchAlbumWorkoutContext } = useAlbumWorkoutsContext();
  const { albumContents, dispatchAlbumContentContext } =
    useAlbumContentsContext();

  const [albumWorkoutDetail, setAlbumWorkoutDetail] = useState();
  const [showDetails, setShowDetails] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [editorStateTemp, setEditorStateTemp] = useState(() =>
    EditorState.createEmpty()
  );
  const [convertedContent, setConvertedContent] = useState(null);
  const [convertedContentTemp, setConvertedContentTemp] = useState(null);
  const [isError, setIsError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [openContentModal, setOpenContentModal] = useState(false);
  const [openExercisesModal, setOpenExercisesModal] = useState(false);
  const [titleContent, setTitleContent] = useState("");
  const [descriptionContent, setDescriptionContent] = useState("");
  const [nameExercise, setNameExercise] = useState("");
  const [setsExercise, setSetsExercise] = useState(0);
  const [repsExercise, setRepsExercise] = useState(0);
  const [exerciseArray, setExerciseArray] = useState([]);
  const [timeExercise, setTimeExercise] = useState(0);
  const [detailedInstructions, setDetailedInstructions] = useState("");

  useEffect(() => {
    const fetchAlbumWorkouts = async () => {
      const response = await fetch(`${API_ROOT}/v1/albumWorkout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatchAlbumWorkoutContext({
          type: "SET_ALBUM_WORKOUTS",
          payload: json,
        });
      }
      if (!response.ok) {
        toast.error("Something went wrong! Please reload page!");
      }
    };

    const fetchAlbumWorkout = async () => {
      const response = await fetch(`${API_ROOT}/v1/albumWorkout/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setAlbumWorkoutDetail(json);
        if (!isEmpty(json.details)) {
          const contentState = convertFromRaw(json.details);

          setEditorState(EditorState.createWithContent(contentState));
          setEditorStateTemp(EditorState.createWithContent(contentState));
        }
      }

      if (!response.ok) {
        setIsError(true);
        toast.error("Something went wrong! Please try again!");
        setIsLoadingPage(false);
      }
    };
    if (user) {
      setIsLoadingPage(true);
      fetchAlbumWorkouts();
      fetchAlbumWorkout();
    } else {
      toast.error("Something went wrong! Please try again!");
    }
  }, [params, user, dispatchAlbumWorkoutContext]);

  useEffect(() => {
    const fetchAlbumContents = async () => {
      const response = await fetch(
        `${API_ROOT}/v1/albumContent/${albumWorkoutDetail?._id}`,
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
        dispatchAlbumContentContext({
          type: "SET_ALBUM_CONTENT",
          payload: json,
        });
        setIsLoadingPage(false);
      }

      if (!response.ok) {
        toast.error("Something went wrong! Please refresh the page!");
        setIsLoadingPage(false);
      }
    };

    if (user && albumWorkoutDetail) {
      setIsLoadingPage(true);
      fetchAlbumContents();
    }
  }, [user, dispatchAlbumContentContext, albumWorkoutDetail]);

  useEffect(() => {
    const html = convertToHTML({
      styleToHTML: (style) => {
        let color;
        let fontSize;
        let fontFamily;
        if (style.startsWith("color-")) {
          color = style.replace("color-", "");
          return <span style={{ color }} />;
        }
        if (style.startsWith("fontsize-")) {
          fontSize = style.replace("fontsize-", "") + "px";
          return <span style={{ fontSize }} />;
        }
        if (style.startsWith("fontfamily-")) {
          fontFamily = style.replace("fontfamily-", "");
          return <span style={{ fontFamily }} />;
        }
        return null;
      },
    })(editorState.getCurrentContent());

    setConvertedContent(html);
  }, [editorState]);

  useEffect(() => {
    const html = convertToHTML({
      styleToHTML: (style) => {
        let color;
        let fontSize;
        let fontFamily;
        if (style.startsWith("color-")) {
          color = style.replace("color-", "");
          return <span style={{ color }} />;
        }
        if (style.startsWith("fontsize-")) {
          fontSize = style.replace("fontsize-", "") + "px";
          return <span style={{ fontSize }} />;
        }
        if (style.startsWith("fontfamily-")) {
          fontFamily = style.replace("fontfamily-", "");
          return <span style={{ fontFamily }} />;
        }
        return null;
      },
    })(editorStateTemp.getCurrentContent());

    setConvertedContentTemp(html);
  }, [editorStateTemp]);

  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html),
    };
  }

  const handleUpdateDetails = async () => {
    setIsLoading(true);
    const contentState = isUpdate
      ? editorStateTemp.getCurrentContent()
      : editorState.getCurrentContent();
    let rawData = convertToRaw(contentState);
    if (!rawData.blocks[0].text) {
      rawData = {};
    }

    const response = await fetch(
      `${API_ROOT}/v1/albumWorkout/${albumWorkoutDetail._id}/details`,
      {
        method: "PUT",
        body: JSON.stringify(rawData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    const json = await response.json();
    if (response.ok) {
      toast.success("Update details successfully!");
      dispatchAlbumWorkoutContext({
        type: "UPDATE_ALBUM_WORKOUT",
        payload: json,
      });
      setEditorStateTemp(EditorState.createWithContent(contentState));
      setEditorState(EditorState.createWithContent(contentState));
      setAlbumWorkoutDetail(json);
      setIsUpdate(false);
      setAnchorEl(null);
      document.getElementById("details").style.width = "100%";
      document.getElementById("details").style.height = "fit-content";
      setTimeout(() => {
        document.getElementById("details").style.height = `${
          document.getElementById("details").offsetHeight
        }px`;
      }, 300);
      setIsLoading(false);
    }

    if (!response.ok) {
      toast.error("Something went wrong. Please try again!");
      setIsLoading(false);
    }
  };

  const handelCreateContent = async () => {
    setIsLoading(true);
    if (exerciseArray?.length <= 0 || !titleContent || !descriptionContent) {
      toast.error("Please enter complete information before create!");
      setIsLoading(false);
    } else {
      const albumContentData = {
        albumContentName: titleContent,
        description: descriptionContent,
        exercises: exerciseArray,
      };
      const response = await fetch(
        `${API_ROOT}/v1/albumContent/${albumWorkoutDetail?._id}`,
        {
          method: "POST",
          body: JSON.stringify(albumContentData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const json = await response.json();
      if (response.ok) {
        setTitleContent("");
        setDescriptionContent("");
        setExerciseArray([]);
        setOpenContentModal(false);
        dispatchAlbumContentContext({
          type: "CREATE_ALBUM_CONTENT",
          payload: json[0],
        });
        setIsLoading(false);
      }

      if (!response.ok) {
        toast.error(json.message);
        setTitleContent("");
        setDescriptionContent("");
        setExerciseArray([]);
        setOpenContentModal(false);
        setIsLoading(false);
      }
    }
  };

  const handleCancelCreateContent = () => {
    setTitleContent("");
    setDescriptionContent("");
    setExerciseArray([]);
    setOpenContentModal(false);
  };

  const handleCreateExercise = async () => {
    if (
      !nameExercise ||
      // !setsExercise ||
      // !repsExercise ||
      !detailedInstructions
    ) {
      toast.error("Please enter complete information before save!");
      return;
    } else {
      let sets = setsExercise;
      let reps = repsExercise;
      let time = timeExercise;

      if (
        setsExercise.toString().length > 1 &&
        setsExercise.toString()[0] === "0"
      ) {
        sets = setsExercise.toString().slice(1);
      }

      if (
        repsExercise.toString().length > 1 &&
        repsExercise.toString()[0] === "0"
      ) {
        reps = repsExercise.toString().slice(1);
      }

      if (
        timeExercise.toString().length > 1 &&
        timeExercise.toString()[0] === "0"
      ) {
        time = timeExercise.toString().slice(1);
      }
      setExerciseArray((preState) => {
        return [
          ...preState,
          {
            nameExercise,
            // setsExercise,
            // repsExercise,
            // timeExercise,
            setsExercise: sets,
            repsExercise: reps,
            timeExercise: time,
            detailedInstructions,
          },
        ];
      });
      setNameExercise("");
      setSetsExercise(0);
      setRepsExercise(0);
      setTimeExercise(0);
      setDetailedInstructions("");
      setOpenExercisesModal(false);
    }
  };

  const handleCancelCreateExercise = () => {
    setNameExercise("");
    setSetsExercise(0);
    setRepsExercise(0);
    setTimeExercise(0);
    setDetailedInstructions("");
    setOpenExercisesModal(false);
  };

  return (
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
          setAlbumWorkoutDetail();
          navigate("/public_album_workouts");
        }}
      />

      {albumWorkoutDetail && !isError ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              maxWidth: "100vw",
              height: "408px",
              overflow: "hidden",
            }}
          >
            <img
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
              src={albumWorkoutDetail?.imgURL}
              alt="album_image"
            />
          </Box>
          <Typography variant="h2" sx={{ marginTop: "20px" }}>
            {albumWorkoutDetail?.title}
          </Typography>

          {/* {!albumWorkoutDetail?.details && */}
          {isEmpty(albumWorkoutDetail?.details) &&
          user?.userId !== albumWorkoutDetail?.userId ? (
            ""
          ) : (
            <Box
              sx={{
                width: "100%",
                position: "relative",
                height: "81px",
                overflow: "hidden",
              }}
            >
              <Tooltip title="Details">
                <div
                  id="detailZip"
                  className={styles.details}
                  onClick={() => {
                    const element = document.querySelector("#detailZip");
                    if (element && isUpdate) {
                      setIsUpdate(false);
                      setAnchorEl(null);
                    }
                    if (showDetails && element) {
                      document.getElementById("details").style = "";
                      element.classList.remove(
                        styles.animationSlideLeftToRight
                      );
                      element.classList.add(styles.animationSlideRightToLeft);
                      setShowDetails(!showDetails);
                    }
                    if (!showDetails && element) {
                      element.classList.remove(
                        styles.animationSlideRightToLeft
                      );
                      element.classList.add(styles.animationSlideLeftToRight);

                      document.getElementById("details").style.width = "100%";
                      document.getElementById("details").style.height =
                        "fit-content";
                      setTimeout(() => {
                        document.getElementById("details").style.height = `${
                          document.getElementById("details").offsetHeight
                        }px`;
                      }, 1100);

                      setShowDetails(!showDetails);
                    }
                  }}
                >
                  <QuestionMarkIcon sx={{ color: "#fff" }} />
                </div>
              </Tooltip>
            </Box>
          )}

          <div
            id="details"
            className={`${styles.editorContainer} ${
              // (showDetails && !albumWorkoutDetail?.details) || isUpdate
              (showDetails && isEmpty(albumWorkoutDetail?.details)) || isUpdate
                ? styles.editorContainerExpanded
                : ""
            } 
            ${
              // showDetails && albumWorkoutDetail?.details && !isUpdate
              showDetails && !isEmpty(albumWorkoutDetail?.details) && !isUpdate
                ? styles.detailsContainerExpanded
                : ""
            }
            `}
          >
            {/* {albumWorkoutDetail?.details && !isUpdate ? ( */}
            {!isEmpty(albumWorkoutDetail?.details) && !isUpdate ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {user?.userId === albumWorkoutDetail?.userId ? (
                  <>
                    <MoreVertIcon
                      sx={{
                        fontSize: "30px",
                        color: "#10cd98",
                        cursor: "pointer",
                        "&:hover": {
                          color: "rgb(17 122 93)",
                        },
                      }}
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                      }}
                    />
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
                        onClick={() => {
                          setIsUpdate(true);
                          document.getElementById("details").style.height =
                            "360px";
                        }}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <EditNoteIcon />
                        <Typography>Update</Typography>
                      </MenuItem>

                      <MenuItem
                        // onClick={() => setOpenModalDelete(true)}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <DeleteForeverIcon sx={{ padding: 0 }} />
                        <Typography>Delete</Typography>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  ""
                )}

                <div
                  dangerouslySetInnerHTML={createMarkup(convertedContent)}
                ></div>
              </div>
            ) : (
              <div>
                <Editor
                  placeholder="Type detail information of album here..."
                  editorState={isUpdate ? editorStateTemp : editorState}
                  onEditorStateChange={
                    isUpdate ? setEditorStateTemp : setEditorState
                  }
                  wrapperClassName={styles.wrapper}
                  editorClassName={styles.editor}
                  toolbarClassName={styles.toolbar}
                  toolbar={{
                    options: [
                      "inline",
                      "blockType",
                      "fontSize",
                      "fontFamily",
                      "list",
                      "colorPicker",
                      "emoji",
                      "history",
                    ],
                    blockType: {
                      options: [
                        "Normal",
                        "H1",
                        "H2",
                        "H3",
                        "H4",
                        "H5",
                        "H6",
                        "Blockquote",
                      ],
                    },
                    inline: {
                      options: ["bold", "italic", "underline"],
                    },
                    list: {
                      options: ["unordered", "ordered"],
                    },

                    history: {
                      options: ["undo", "redo"],
                    },
                  }}
                />
                {isLoading ? (
                  <Button
                    sx={{
                      backgroundColor: "#10cd98",
                      "&:hover": {
                        backgroundColor: "rgb(17 122 93)",
                      },
                      color: "#fff",
                      textTransform: "none",
                      position: "relative",
                      left: "calc(100% - 65px)",
                      marginTop: "20px",
                    }}
                  >
                    <CircularProgress size="18px" sx={{ color: "#fff" }} />
                  </Button>
                ) : (
                  <Button
                    sx={{
                      backgroundColor: "#10cd98",
                      "&:hover": {
                        backgroundColor: "rgb(17 122 93)",
                      },
                      color: "#fff",
                      textTransform: "none",
                      position: "relative",
                      left: "calc(100% - 65px)",
                      marginTop: "20px",
                    }}
                    onClick={handleUpdateDetails}
                  >
                    Save
                  </Button>
                )}
              </div>
            )}
          </div>
        </Box>
      ) : (
        ""
      )}

      {albumWorkoutDetail?.userId === user?.userId ? (
        <Button
          sx={{
            textTransform: "none",
            marginTop: "30px",
            backgroundColor: "#10cd98",
            color: "#fff",
            "&:hover": {
              backgroundColor: "rgb(17 122 93)",
            },
          }}
          startIcon={<ArticleIcon />}
          onClick={() => setOpenContentModal(true)}
        >
          Create content
        </Button>
      ) : (
        ""
      )}

      <Modal
        open={openContentModal}
        onClose={() => setOpenContentModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleCreateContentModal}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Create Content
          </Typography>
          <TextField
            id="outlined-basic"
            label="Album content name"
            variant="outlined"
            placeholder="Enter content name of album..."
            fullWidth
            sx={TEXTFIELD_STYLES}
            value={titleContent}
            onChange={(e) => setTitleContent(e.target.value)}
          />

          {/* <TextField
            id="outlined-basic"
            label="Description"
            variant="outlined"
            placeholder="Enter description of content..."
            fullWidth
            sx={TEXTFIELD_STYLES}
            value={descriptionContent}
            onChange={(e) => setDescriptionContent(e.target.value)}
          /> */}
          <Box
            sx={{ marginTop: "20px", maxHeight: "150px", overflowY: "auto" }}
          >
            <TextareaAutosize
              aria-label="Detailed instructions"
              minRows={3}
              placeholder="Please type detailed instructions here..."
              value={descriptionContent}
              onChange={(e) => setDescriptionContent(e.target.value)}
              className={styles.detailedInstructions}
            />
          </Box>
          <Box
            sx={{
              maxHeight: "200px",
              overflowY: "auto",
              scrollbarWidth: "thin",
            }}
          >
            {exerciseArray?.length > 0
              ? exerciseArray.map((item, index) => {
                  return (
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
                            {item.nameExercise}
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
                            x {item.timeExercise}s
                            {/* {item.timeExercise
                              ? ` x ${item.timeExercise}s`
                              : ""} */}
                          </Typography>
                          <CancelIcon
                            sx={{
                              color: "red",
                              cursor: "pointer",
                              "&:hover": {
                                color: "#f06e6e",
                              },
                            }}
                            onClick={() => {
                              setExerciseArray((prevState) => {
                                const exercises = [...prevState];
                                exercises.splice(index, 1);
                                return [...exercises];
                              });
                            }}
                          />
                        </Box>
                      </Box>
                      <Divider key={`Divider ${index}`} />
                    </Box>
                  );
                })
              : ""}
          </Box>
          <Chip
            icon={<AddIcon />}
            label="Add exercises"
            clickable
            onClick={() => setOpenExercisesModal(true)}
            sx={{ marginTop: "20px" }}
          />
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
              width: "fit-content",
              position: "relative",
              left: "calc(100% - 138px)",
            }}
          >
            <Button
              sx={BUTTON_STYLES}
              onClick={isLoading ? () => {} : handelCreateContent}
            >
              {isLoading ? (
                <CircularProgress size="18px" sx={{ color: "#fff" }} />
              ) : (
                "Create"
              )}
            </Button>
            <Button
              sx={BUTTON_STYLES}
              onClick={isLoading ? () => {} : handleCancelCreateContent}
            >
              Cancel
            </Button>
          </Box>
          <Modal
            open={openExercisesModal}
            onClose={() => setOpenExercisesModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleCreateContentModal}>
              <Typography id="modal-modal-title" variant="h4" component="h2">
                Add Exercise
              </Typography>
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                placeholder="Enter exercise name..."
                fullWidth
                type="text"
                sx={TEXTFIELD_STYLES}
                value={nameExercise}
                onChange={(e) => setNameExercise(e.target.value)}
              />

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
              <TextField
                id="outlined-basic"
                label="Time (Optional)"
                variant="outlined"
                placeholder="Enter limit time in seconds..."
                type="number"
                fullWidth
                sx={TEXTFIELD_STYLES}
                value={timeExercise}
                onChange={(e) =>
                  e.target.value >= 0 && setTimeExercise(e.target.value)
                }
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                Detailed instructions
              </Typography>
              <Box sx={{ overflowY: "auto", maxHeight: "100px" }}>
                <TextareaAutosize
                  aria-label="Detailed instructions"
                  minRows={3}
                  placeholder="Please type detailed instructions here..."
                  value={detailedInstructions}
                  onChange={(e) => setDetailedInstructions(e.target.value)}
                  className={styles.detailedInstructions}
                />
              </Box>
              <Box
                sx={{
                  marginTop: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  position: "relative",
                  width: "fit-content",
                  left: "calc(100% - 140px)",
                }}
              >
                <Button sx={BUTTON_STYLES} onClick={handleCreateExercise}>
                  Save
                </Button>
                <Button sx={BUTTON_STYLES} onClick={handleCancelCreateExercise}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
      </Modal>

      {isError ? (
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
      ) : (
        ""
      )}
      <Box
        sx={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {isLoadingPage ? (
          <Box
            sx={{
              marginTop: "30px",
              width: "fit-content",
              margin: "auto",
            }}
          >
            <CircularProgress />
          </Box>
        ) : albumContents?.length > 0 ? (
          <div
            // sx={{
            //   display: "flex",
            //   flexWrap: "wrap",
            //   gap: "20px",
            // }}
            className={styles.albumContents}
          >
            {albumContents?.map((item, index) => (
              <>
                <AlbumContent
                  albumContent={item}
                  userId={albumWorkoutDetail?.userId}
                  key={index}
                />
              </>
            ))}
          </div>
        ) : (
          ""
        )}
      </Box>
    </>
  );
}

export default AlbumWorkoutDetails;
