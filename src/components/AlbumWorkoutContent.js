import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { env } from "../config/environment";
import { API_ROOT } from "../ultilities/constants";
import { toast } from "react-toastify";
import { useAlbumWorkoutsContext } from "../hooks/useAlbumWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import styles from "../pages/AlbumWorkout/AlbumWorkout.module.css";

import BookmarkIcon from "@mui/icons-material/Bookmark";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PublicIcon from "@mui/icons-material/Public";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import Avatar from "@mui/material/Avatar";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CancelIcon from "@mui/icons-material/Cancel";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import { useAlbumStoragesContext } from "../hooks/useAlbumStoragesContext";
import { useAlbumProfilesContext } from "../hooks/useAlbumProfilesContext";

function AlbumWorkoutContent({ albumWorkout }) {
  const { user } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [fileUpload, setFileUpload] = useState("");
  const [typeFileUpLoad, setTypeFileUpload] = useState("");
  const [titleAlbum, setTitleAlbum] = useState("");
  const [descriptionAlbum, setDescriptionAlbum] = useState("");
  // const [statusAlbum, setStatusAlbum] = useState("Public");
  const [statusAlbum, setStatusAlbum] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [openDialogLikeUsers, setOpenDialogLikeUsers] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { dispatchAlbumWorkoutContext } = useAlbumWorkoutsContext();
  const { dispatchAlbumStorageContext } = useAlbumStoragesContext();
  const { albumProfiles, dispatchAlbumProfileContext } =
    useAlbumProfilesContext();

  const styleModalUpdateAlbum = {
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

  const styleModalDeleteAlbum = {
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

  useEffect(() => {
    if (albumWorkout) {
      albumWorkout?.likedUsers?.forEach((item) => {
        if (item._id.includes(user?.userId)) {
          setIsLiked(true);
        }
      });
      albumWorkout?.storedUsers?.forEach((item) => {
        if (item._id.includes(user?.userId)) {
          setIsSaved(true);
        }
      });
    }
  }, [albumWorkout, user]);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const uploadFile = async (type, timestamp, signature) => {
    const data = new FormData();
    data.append("file", fileUpload);
    data.append("timestamp", timestamp);
    data.append("signature", signature);
    data.append("api_key", env.REACT_APP_CLOUDINARY_API_KEY);
    data.append("folder", type === "image" ? "images" : "videos");

    try {
      const cloudName = env.REACT_APP_CLOUDINARY_NAME;
      const resourceType = type;

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const json = await response.json();
      const { secure_url, public_id } = json;
      return { secure_url, public_id };
    } catch (error) {
      toast.error("Something went wrong! Please try again!");
      setIsLoading(false);
    }
  };

  const getSignatureForUpload = async (folder) => {
    try {
      const response = await fetch(`${API_ROOT}/v1/albumWorkout/sign-upload`, {
        method: "POST",
        body: JSON.stringify({ folder: folder }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      return await response.json();
    } catch (error) {
      toast.error("Something went wrong! Please try again!");
      setIsLoading(false);
    }
  };

  const handleUpdateAlbum = async () => {
    if (
      !titleAlbum &&
      !fileUpload &&
      !typeFileUpLoad &&
      !descriptionAlbum &&
      // statusAlbum === "Public"
      !statusAlbum
    ) {
      toast.error("Please change one field before update!");
    } else {
      try {
        setIsLoading(true);
        if (typeFileUpLoad === "image") {
          const { timestamp: imgTimestamp, signature: imgSignature } =
            await getSignatureForUpload("images");
          const dataImage = await uploadFile(
            typeFileUpLoad,
            imgTimestamp,
            imgSignature
          );
          const imgUrl = dataImage.secure_url;
          const img_public_id = dataImage.public_id;
          if (!imgUrl) {
            toast.error("Cannot upload image! Please try again!");
            setIsLoading(false);
          } else {
            const albumWorkoutData = {
              imgURL: imgUrl,
              // status: statusAlbum,
              imgPublicId: img_public_id,
              oldImgPublicId: albumWorkout?.imgPublicId,
            };
            if (titleAlbum) {
              albumWorkoutData.title = titleAlbum;
            }
            if (descriptionAlbum) {
              albumWorkoutData.description = descriptionAlbum;
            }
            if (statusAlbum) {
              albumWorkoutData.status = statusAlbum;
            }
            const response = await fetch(
              `${API_ROOT}/v1/albumWorkout/${albumWorkout._id}`,
              {
                method: "PUT",
                body: JSON.stringify(albumWorkoutData),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user?.token}`,
                },
              }
            );
            const json = await response.json();
            if (response.ok) {
              dispatchAlbumWorkoutContext({
                type: "UPDATE_ALBUM_WORKOUT",
                payload: json,
              });

              dispatchAlbumStorageContext({
                type: "UPDATE_ALBUM_STORAGE",
                payload: json,
              });

              // if (
              //   location.pathname === "/profile" &&
              //   albumProfiles?.length > 0
              // ) {
              dispatchAlbumProfileContext({
                type: "UPDATE_ALBUM_PROFILE",
                payload: json,
              });
              // }

              toast.success("Update album successfully!");
              setTitleAlbum("");
              setDescriptionAlbum("");
              // setStatusAlbum("Public");
              setStatusAlbum("");
              setOpenModalUpdate(false);
              setTypeFileUpload("");
              setFileUpload("");
              setIsLoading(false);
            }
            if (!response.ok) {
              toast.error(json.message);
              setIsLoading(false);
            }
          }
        } else {
          const albumWorkoutData = {
            // status: statusAlbum,
          };
          if (titleAlbum) {
            albumWorkoutData.title = titleAlbum;
          }
          if (descriptionAlbum) {
            albumWorkoutData.description = descriptionAlbum;
          }
          if (statusAlbum) {
            albumWorkoutData.status = statusAlbum;
          }
          const response = await fetch(
            `${API_ROOT}/v1/albumWorkout/${albumWorkout._id}`,
            {
              method: "PUT",
              body: JSON.stringify(albumWorkoutData),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );
          const json = await response.json();
          if (response.ok) {
            dispatchAlbumWorkoutContext({
              type: "UPDATE_ALBUM_WORKOUT",
              payload: json,
            });

            dispatchAlbumStorageContext({
              type: "UPDATE_ALBUM_STORAGE",
              payload: json,
            });

            // if (location.pathname === "/profile" && albumProfiles?.length > 0) {
            dispatchAlbumProfileContext({
              type: "UPDATE_ALBUM_PROFILE",
              payload: json,
            });
            // }

            toast.success("Update album successfully!");
            setTitleAlbum("");
            setDescriptionAlbum("");
            // setStatusAlbum("Public");
            setStatusAlbum("");
            setOpenModalUpdate(false);
            setTypeFileUpload("");
            setFileUpload("");
            setIsLoading(false);
          }
          if (!response.ok) {
            toast.error(json.message);
            setIsLoading(false);
          }
        }
      } catch (error) {
        toast.error("Something went wrong! Please try again!");
        setIsLoading(false);
      }
    }
  };

  const handleDeleteAlbum = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${API_ROOT}/v1/albumWorkout/${albumWorkout._id}`,
      {
        method: "DELETE",
        body: JSON.stringify({ imgPublicId: albumWorkout.imgPublicId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    const json = await response.json();

    if (response.ok) {
      dispatchAlbumWorkoutContext({ type: "DELETE_WORKOUT", payload: json });
      dispatchAlbumStorageContext({
        type: "DELETE_STORAGE",
        payload: json,
      });

      // if (location.pathname === "/profile" && albumProfiles?.length > 0) {
      dispatchAlbumProfileContext({
        type: "DELETE_ALBUM_PROFILE",
        payload: json,
      });
      // }
      setOpenModalDelete(false);
      toast.success("Delete successfully!");
      setIsLoading(false);
    }

    if (!response.ok) {
      toast.error("Something went wrong! Please try again!");
      setIsLoading(false);
    }
  };

  const handleLikeAlbum = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${API_ROOT}/v1/albumWorkout/like/${albumWorkout._id}`,
      {
        method: "POST",
        body: isLiked
          ? JSON.stringify({ isLike: false })
          : JSON.stringify({ isLike: true }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    const json = await response.json();
    if (response.ok) {
      setIsLiked(!isLiked);
      dispatchAlbumWorkoutContext({
        type: "UPDATE_ALBUM_WORKOUT",
        payload: json,
      });

      dispatchAlbumStorageContext({
        type: "UPDATE_ALBUM_STORAGE",
        payload: json,
      });

      // if (location.pathname === "/profile" && albumProfiles?.length > 0) {
      dispatchAlbumProfileContext({
        type: "UPDATE_ALBUM_PROFILE",
        payload: json,
      });
      // }

      setIsLoading(false);
    }
    if (!response.ok) {
      toast.error("Something went wrong! please try again!");
      setIsLoading(false);
    }
  };

  const handleShowLikedUsers = () => {
    setOpenDialogLikeUsers(true);
  };

  const handleSaveAlbum = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${API_ROOT}/v1/albumStorage/${albumWorkout._id}`,
      {
        method: "POST",
        body: isSaved
          ? JSON.stringify({ isSave: false })
          : JSON.stringify({ isSave: true }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    const json = await response.json();
    if (response.ok) {
      dispatchAlbumWorkoutContext({
        type: "UPDATE_ALBUM_WORKOUT",
        payload: json,
      });

      if (isSaved) {
        dispatchAlbumStorageContext({
          type: "DELETE_STORAGE",
          payload: json,
        });
        toast.success("Remove album from storage successfully!");
      }
      if (!isSaved) {
        dispatchAlbumStorageContext({
          type: "UPDATE_ALBUM_STORAGE",
          payload: json,
        });
        toast.success("Save album to storage successfully!");
      }

      // if (location.pathname === "/profile" && albumProfiles?.length > 0) {
      dispatchAlbumProfileContext({
        type: "UPDATE_ALBUM_PROFILE",
        payload: json,
      });
      // }
      // isSaved
      //   ? toast.success("Remove album from storage successfully!")
      //   : toast.success("Save album to storage successfully!");
      setIsSaved(!isSaved);
      setIsLoading(false);
    }
    if (!response.ok) {
      toast.error("Something went wrong! please try again!");
      setIsLoading(false);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 330,
        marginTop: "20px",
        "&:hover": {
          boxShadow: "5px 10px 18px grey",
          ".MuiCardMedia-root": {
            transform: "scale(1.2)",
            rotate: "9deg",
          },
        },

        cursor: "pointer",
      }}
      key={albumWorkout?._id}
    >
      <CardHeader
        avatar={
          <Tooltip title={albumWorkout?.userName}>
            <Avatar
              aria-label="recipe"
              src={albumWorkout?.avatarImg}
              onClick={() => {
                navigate("/profile", { state: albumWorkout?.userId });
              }}
            ></Avatar>
          </Tooltip>
        }
        action={
          user?.userId === albumWorkout?.userId ? (
            <>
              <IconButton
                aria-label="settings"
                onClick={(e) => {
                  setAnchorEl(e.currentTarget);
                }}
              >
                <MoreVertIcon />
              </IconButton>
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
                open={openModalUpdate}
                onClose={() => {
                  if (!isLoading) {
                    setTitleAlbum("");
                    setDescriptionAlbum("");
                    setTypeFileUpload("");
                    setFileUpload("");
                    // setStatusAlbum("Public");
                    setStatusAlbum("");
                    setOpenModalUpdate(false);
                  }
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={styleModalUpdateAlbum}>
                  <Typography id="modal-modal-title" variant="h4">
                    Update album
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    label="Album title"
                    variant="outlined"
                    fullWidth
                    sx={{
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
                    }}
                    value={titleAlbum}
                    placeholder={albumWorkout?.title}
                    onChange={(e) => setTitleAlbum(e.target.value)}
                  />
                  <Typography variant="h6" sx={{ marginTop: "20px" }}>
                    Album thumbnail image
                  </Typography>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      marginTop: "10px",
                      backgroundColor: "#10cd98",
                      textTransform: "none",
                    }}
                  >
                    Upload image
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => {
                        if (e.target.files[0].type.split("/")[0] !== "image") {
                          toast.error("Error: Please choose image file!");
                          setFileUpload("");
                          setTypeFileUpload("");
                        } else {
                          setFileUpload(e.target.files[0]);
                          setTypeFileUpload(
                            e.target.files[0].type.split("/")[0]
                          );
                        }
                      }}
                      multiple
                    />
                  </Button>
                  <Typography sx={{ marginTop: "10px" }}>
                    {fileUpload.name && typeFileUpLoad
                      ? `${typeFileUpLoad}: ${fileUpload.name}`
                      : ""}
                  </Typography>
                  <Typography variant="h6" sx={{ marginTop: "20px" }}>
                    Album description
                  </Typography>
                  <Box sx={{ overflowY: "auto", maxHeight: "200px" }}>
                    <TextareaAutosize
                      aria-label="Album description"
                      minRows={3}
                      placeholder={albumWorkout?.description}
                      value={descriptionAlbum}
                      onChange={(e) => setDescriptionAlbum(e.target.value)}
                      className={styles.description}
                    />
                  </Box>
                  <Box sx={{ width: "150px", marginTop: "10px" }}>
                    <FormControl
                      fullWidth
                      sx={{
                        "& label": {
                          color: "#000",
                        },
                        "& label.Mui-focused": {
                          color: "#000",
                        },
                      }}
                    >
                      <InputLabel id="demo-simple-select-label">
                        Status
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
                        // value={statusAlbum === "Public" ? "Public" : "Private"}
                        value={statusAlbum}
                        label="Status"
                        onChange={(e) => setStatusAlbum(e.target.value)}
                      >
                        <MenuItem value="Public">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <PublicIcon sx={{ color: "#17ad80" }} /> Public
                          </Box>
                        </MenuItem>
                        <MenuItem value="Private">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <VpnLockIcon sx={{ color: "#17ad80" }} /> Private
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    {isLoading ? (
                      <Button
                        sx={{
                          textTransform: "none",
                          fontSize: "15px",
                          backgroundColor: "#10cd98",
                          color: "#fff",
                          width: "64px",
                          height: "39px",
                          "&:hover": {
                            backgroundColor: "rgb(17 122 93)",
                          },
                        }}
                      >
                        <CircularProgress size="18px" sx={{ color: "#fff" }} />
                      </Button>
                    ) : (
                      <Button
                        sx={{
                          textTransform: "none",
                          fontSize: "15px",
                          backgroundColor: "#10cd98",
                          color: "#fff",
                          width: "64px",
                          height: "39px",
                          "&:hover": {
                            backgroundColor: "rgb(17 122 93)",
                          },
                        }}
                        onClick={handleUpdateAlbum}
                      >
                        Update
                      </Button>
                    )}
                    {isLoading ? (
                      <Button
                        sx={{
                          textTransform: "none",
                          fontSize: "15px",
                          backgroundColor: "#10cd98",
                          color: "#fff",
                          width: "64px",
                          height: "39px",
                          "&:hover": {
                            backgroundColor: "rgb(17 122 93)",
                          },
                        }}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button
                        sx={{
                          textTransform: "none",
                          fontSize: "15px",
                          backgroundColor: "#10cd98",
                          color: "#fff",
                          width: "64px",
                          height: "39px",
                          "&:hover": {
                            backgroundColor: "rgb(17 122 93)",
                          },
                        }}
                        onClick={() => {
                          setTitleAlbum("");
                          setDescriptionAlbum("");
                          setTypeFileUpload("");
                          setFileUpload("");
                          // setStatusAlbum("Public");
                          setStatusAlbum("");
                          setOpenModalUpdate(false);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </Box>
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
                  <Box sx={styleModalDeleteAlbum}>
                    <Typography
                      id="transition-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Delete album ?
                    </Typography>
                    <Box id="transition-modal-description" sx={{ mt: 2 }}>
                      <p>
                        This action will delete all informations in this record!
                        Are you sure about this ?
                      </p>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "10px",
                        }}
                      >
                        <Button
                          onClick={handleDeleteAlbum}
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
                            <CircularProgress
                              size="18px"
                              sx={{ color: "#1aac83" }}
                            />
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
            </>
          ) : (
            ""
          )
        }
        title={albumWorkout?.title}
        subheader={format(
          new Date(albumWorkout?.createdAt),
          "HH:mm dd/MM/yyyy"
        )}
      />
      <Box
        sx={{
          width: "345px",
          height: "194px",
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          height="194"
          image={albumWorkout?.imgURL}
          alt="Thumbnail image"
          sx={{
            objectFit: "cover",
            transition: "1s ease",
          }}
        />
      </Box>

      <CardContent
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
          height: "50px",
          width: "330px",
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {albumWorkout?.description}
        </Typography>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Like">
              <IconButton
                aria-label="add to favorites"
                onClick={isLoading ? () => {} : handleLikeAlbum}
              >
                <FavoriteIcon
                  sx={{ color: isLiked ? "#E00000" : "rgb(117 117 117)" }}
                />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{
                fontSize: "20.5px",
                color: "#0b8c68",
                "&:hover": { color: "#13cfac" },
              }}
              onClick={handleShowLikedUsers}
            >
              {albumWorkout?.likeNumber <= 0 ? "" : albumWorkout?.likeNumber}
            </Typography>
            <Dialog
              open={openDialogLikeUsers}
              keepMounted
              onClose={() => setOpenDialogLikeUsers(false)}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FavoriteIcon sx={{ color: "#E00000" }} />
                  <span style={{ fontSize: "20.5px", color: "#0b8c68" }}>
                    {albumWorkout?.likeNumber <= 0
                      ? ""
                      : albumWorkout?.likeNumber}
                  </span>
                </Box>

                <Box onClick={() => setOpenDialogLikeUsers(false)}>
                  <CancelIcon
                    sx={{
                      color: "#bdbdbd",
                      "&:hover": {
                        color: "#a4a4a4",
                      },
                      fontSize: "30px",
                      cursor: "pointer",
                    }}
                  />
                </Box>
              </DialogTitle>
              <DialogContent
                sx={{
                  width: "300px",
                  overflowY: "auto",
                  maxHeight: "210px",
                }}
              >
                <DialogContentText id="alert-dialog-slide-description">
                  {albumWorkout.likedUsers.map((item) => {
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                          marginBottom: "20px",
                        }}
                        key={item?._id}
                      >
                        <Avatar
                          aria-label="recipe"
                          src={item?.avatarImg}
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            navigate("/profile", { state: item?._id });
                          }}
                        ></Avatar>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            navigate("/profile", { state: item?._id });
                          }}
                        >
                          {item?.userName}
                        </span>
                      </Box>
                    );
                  })}
                </DialogContentText>
              </DialogContent>
            </Dialog>
          </Box>

          {isSaved ? (
            <Tooltip title="Remove album from storage">
              <IconButton
                aria-label="share"
                onClick={isLoading ? () => {} : handleSaveAlbum}
                sx={{ marginLeft: "10px" }}
              >
                <BookmarkRemoveIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Save to storage">
              <IconButton
                aria-label="share"
                onClick={isLoading ? () => {} : handleSaveAlbum}
                sx={{ marginLeft: "10px" }}
              >
                <BookmarkIcon aria-label="add to store" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Button
          sx={{
            textTransform: "none",
            color: "#fff",
            backgroundColor: "#10cd98",
            marginRight: "10px",
            "&:hover": {
              backgroundColor: "rgb(17 122 93)",
            },
          }}
          onClick={() => {
            navigate(`/album_workouts_detail/${albumWorkout._id}`);
          }}
        >
          View details
        </Button>
      </CardActions>
    </Card>
  );
}

export default AlbumWorkoutContent;
