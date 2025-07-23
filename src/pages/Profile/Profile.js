import Avatar from "@mui/material/Avatar";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlbumProfilesContext } from "../../hooks/useAlbumProfilesContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { API_ROOT } from "../../ultilities/constants";
import { toast } from "react-toastify";
import styles from "./Profile.module.css";
import stylesAlbumWorkout from "../AlbumWorkout/AlbumWorkout.module.css";
import { format } from "date-fns";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import PasswordIcon from "@mui/icons-material/Password";
import SettingsIcon from "@mui/icons-material/Settings";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import { env } from "../../config/environment";
import { useWorkoutsContext } from "../../hooks/useWorkoutsContext";
import AlbumWorkoutContent from "../../components/AlbumWorkoutContent";
import Skeleton from "@mui/material/Skeleton";
import { useAlbumWorkoutsContext } from "../../hooks/useAlbumWorkoutsContext";
import { useAlbumStoragesContext } from "../../hooks/useAlbumStoragesContext";

function Profile() {
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

  const styleModal = {
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

  const location = useLocation();

  const { albumProfiles, dispatchAlbumProfileContext } =
    useAlbumProfilesContext();
  const { user, dispatch } = useAuthContext();
  const { dispatchWorkoutContext } = useWorkoutsContext();
  const { dispatchAlbumWorkoutContext } = useAlbumWorkoutsContext();
  const { albumStorages, dispatchAlbumStorageContext } =
    useAlbumStoragesContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isLoading, setIsLoading] = useState(false);
  const [openModalEditProfile, setOpenModalEditProfile] = useState(false);
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false);
  const [userData, setUserData] = useState();
  const [userName, setUserName] = useState("");
  const [userAvatarImg, setUserAvatarImg] = useState("");
  const [fileUpload, setFileUpload] = useState("");
  const [typeFileUpLoad, setTypeFileUpload] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingChangePassword, setIsLoadingChangePassword] = useState(false);

  useEffect(() => {
    const getUserById = async () => {
      const response = await fetch(`${API_ROOT}/v1/user/${location.state}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        setUserData(json);
        setIsLoading(false);
      }

      if (!response.ok) {
        toast.error("Something went wrong! Please try again!");
        setIsLoading(false);
      }
    };

    if (user) {
      setIsLoading(true);
      getUserById();
    }
  }, [location, user]);

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
    if (user) {
      fetchAlbumWorkouts();
    } else {
      toast.error("Something went wrong! Please try again!");
    }
  }, [user, dispatchAlbumWorkoutContext]);

  useEffect(() => {
    const fetchAlbumStorages = async () => {
      const response = await fetch(`${API_ROOT}/v1/albumStorage/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatchAlbumStorageContext({
          type: "SET_ALBUM_STORAGE",
          payload: json,
        });
        setIsLoading(false);
      }

      if (!response.ok) {
        toast.error("Something went wrong! Please try again!");
        setIsLoading(false);
      }
    };

    if (user) {
      setIsLoading(true);
      fetchAlbumStorages();
    } else {
      toast.error("Something went wrong! Please try again!");
    }
  }, [dispatchAlbumStorageContext, user]);

  useEffect(() => {
    if (userData) {
      setUserName(userData?.userName);
      setUserAvatarImg(userData?.avatarImg);
    }
  }, [userData]);

  useEffect(() => {
    const fetchAlbumProfiles = async () => {
      const response = await fetch(
        `${API_ROOT}/v1/albumWorkout/albums-profile/${location.state}`,
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
        dispatchAlbumProfileContext({
          type: "SET_ALBUM_PROFILE",
          payload: json,
        });
        setIsLoading(false);
      }

      if (!response.ok) {
        toast.error("Something went wrong! Please try again!");
        setIsLoading(false);
      }
    };

    if (user) {
      setIsLoading(true);
      fetchAlbumProfiles();
    } else {
      toast.error("Something went wrong! Please try again!");
    }
  }, [dispatchAlbumProfileContext, user, location]);

  const handleLogOut = () => {
    setAnchorEl(null);
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    dispatchWorkoutContext({ type: "LOGOUT" });
    navigate("/login");
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseModalEditProfile = () => {
    if (!isLoadingUpdate) {
      setUserName(userData?.userName);
      setUserAvatarImg(userData?.avatarImg);
      setFileUpload("");
      setTypeFileUpload("");
      setOpenModalEditProfile(false);
    }
  };

  const handleCloseModalChangePassword = () => {
    if (!isLoadingChangePassword) {
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
      setOpenModalChangePassword(false);
    }
  };

  const handleChooseImg = (e) => {
    if (e.target.files[0].type.split("/")[0] !== "image") {
      toast.error("Error: Please choose image file!");
      setFileUpload("");
      setTypeFileUpload("");
    } else {
      setFileUpload(e.target.files[0]);
      setTypeFileUpload(e.target.files[0].type.split("/")[0]);
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        setUserAvatarImg(this.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
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
      // setIsLoading(false);
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
      // setIsLoading(false);
    }
  };

  const handleUpdateInforUser = async () => {
    if (userName !== userData?.userName || (fileUpload && typeFileUpLoad)) {
      setIsLoadingUpdate(true);
      if (fileUpload && typeFileUpLoad) {
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
          // setIsLoading(false);
        } else {
          const accountData = {
            avatarImg: imgUrl,
            imgPublicId: img_public_id,
            oldImgPublicId: userData?.imgPublicId ? userData?.imgPublicId : "",
          };
          if (userName) {
            accountData.userName = userName;
          }
          const response = await fetch(
            `${API_ROOT}/v1/user/${location.state}`,
            {
              method: "PUT",
              body: JSON.stringify(accountData),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );

          const json = await response.json();
          if (response.ok) {
            setUserData(json);
            dispatch({ type: "UPDATE_NAME", payload: json });
            setIsLoadingUpdate(false);
            const localStorageData = JSON.parse(localStorage.getItem("user"));
            const newUserLocalStorage = {
              avatarImg: json?.avatarImg,
              email: localStorageData?.email,
              token: localStorageData?.token,
              userName: json?.userName,
            };
            localStorage.setItem("user", JSON.stringify(newUserLocalStorage));
            setAnchorEl(null);
            handleCloseModalEditProfile();
            toast.success("Update user information successfully!");
          }
          if (!response.ok) {
            setIsLoadingUpdate(false);
            toast.error(json.message);
          }
        }
      }
      if (!fileUpload && !typeFileUpLoad) {
        const response = await fetch(`${API_ROOT}/v1/user/${location.state}`, {
          method: "PUT",
          body: JSON.stringify({ userName: userName }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });

        const json = await response.json();
        if (response.ok) {
          setUserData(json);
          dispatch({ type: "UPDATE_NAME", payload: json });
          setIsLoadingUpdate(false);
          const localStorageData = JSON.parse(localStorage.getItem("user"));
          const newUserLocalStorage = {
            avatarImg: json?.avatarImg,
            email: localStorageData?.email,
            token: localStorageData?.token,
            userName: json?.userName,
          };
          localStorage.setItem("user", JSON.stringify(newUserLocalStorage));
          setAnchorEl(null);
          handleCloseModalEditProfile();
          toast.success("Update user information successfully!");
        }
        if (!response.ok) {
          setIsLoadingUpdate(false);
          toast.error(json.message);
        }
      }
    } else {
      toast.error("You need to change at least one field before updating.");
    }
  };

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      toast.error(
        "Password and Confirm Password do not match. Please try again!"
      );
    }

    if (!password || !confirmPassword || !oldPassword) {
      toast.error("Please complete all required fields before updating.");
    }

    if (
      password === confirmPassword &&
      password &&
      confirmPassword &&
      oldPassword
    ) {
      setIsLoadingChangePassword(true);
      const response = await fetch(
        `${API_ROOT}/v1/user/${location.state}/changePassword`,
        {
          method: "PUT",
          body: JSON.stringify({
            newPassword: password,
            oldPassword: oldPassword,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const json = await response.json();

      if (response.ok) {
        setIsLoadingChangePassword(false);
        setAnchorEl(null);
        handleCloseModalChangePassword();
        toast.success("Change password successfully!");
        handleLogOut();
      }

      if (!response.ok) {
        setIsLoadingChangePassword(false);
        toast.error(json.message);
      }
    }
  };

  // useEffect(() => {
  //   if (albumProfiles?.length > 0 && userData) {
  //     console.log(albumProfiles);
  //     console.log(userData);
  //     console.log(format(new Date(userData?.created), "dd/MM/yyyy"));
  //   }
  // }, [albumProfiles, userData]);

  return (
    <Box sx={{ marginX: "12%" }}>
      {!isLoading ? (
        userData ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className={styles.header}>
              <Avatar
                aria-label="recipe"
                src={userData?.avatarImg}
                sx={{
                  // cursor: userData?.avatarImg ? "pointer" : "auto",
                  width: 180,
                  height: 180,
                }}
                // onClick={
                //   userData?.avatarImg
                //     ? () => {
                //         alert("OK");
                //       }
                //     : () => {}
                // }
              ></Avatar>
              <div className={styles.inforHeader}>
                <div className={styles.inforAccount}>
                  <Typography variant="h3">{userData?.userName}</Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "grey",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <PermContactCalendarIcon sx={{ color: "#8181e3" }} />
                    {`Join Date: ${format(
                      new Date(userData?.created),
                      "dd/MM/yyyy"
                    )}`}
                  </Typography>
                  {albumProfiles?.length > 0 ? (
                    <Typography variant="h6" sx={{ color: "grey" }}>
                      {location.state.toString() === user?.userId.toString()
                        ? `📁 ${albumProfiles?.length} Albums Workout Created`
                        : `📁 ${albumProfiles?.length} Public Albums Workout Created`}
                    </Typography>
                  ) : (
                    ""
                  )}
                </div>
                <Box>
                  {location.state.toString() === user?.userId ? (
                    <Button
                      startIcon={<SettingsIcon />}
                      sx={BUTTON_STYLES}
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    >
                      Settings
                    </Button>
                  ) : (
                    ""
                  )}

                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem
                      onClick={() => setOpenModalEditProfile(true)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <EditIcon sx={{ color: "#10cd98" }} /> Edit Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => setOpenModalChangePassword(true)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <PasswordIcon sx={{ color: "#10cd98" }} /> Change Password
                    </MenuItem>
                  </Menu>

                  <Modal
                    open={openModalEditProfile}
                    onClose={handleCloseModalEditProfile}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={styleModal}>
                      <TextField
                        id="outlined-basic"
                        label="User Name"
                        variant="outlined"
                        fullWidth
                        sx={TEXTFIELD_STYLES}
                        value={userName}
                        placeholder="Enter name..."
                        onChange={(e) => setUserName(e.target.value)}
                      />

                      <Typography variant="h6" sx={{ marginTop: "20px" }}>
                        Avatar Image
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
                          onChange={(e) => handleChooseImg(e)}
                          multiple
                        />
                      </Button>
                      <Typography sx={{ marginTop: "10px" }}>
                        {fileUpload.name && typeFileUpLoad
                          ? `${typeFileUpLoad}: ${fileUpload.name}`
                          : ""}
                      </Typography>

                      <Box sx={{ marginTop: "10px" }}>
                        {fileUpload && typeFileUpLoad ? (
                          <Avatar
                            aria-label="recipe"
                            src={userAvatarImg}
                            sx={{
                              width: 180,
                              height: 180,
                              marginX: "auto",
                            }}
                          ></Avatar>
                        ) : (
                          <Avatar
                            aria-label="recipe"
                            src={userData?.avatarImg}
                            sx={{
                              width: 180,
                              height: 180,
                              marginX: "auto",
                            }}
                          ></Avatar>
                        )}
                      </Box>

                      <Box
                        sx={{
                          marginTop: "20px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "fit-content",
                          position: "relative",
                          left: "calc(100% - 138px)",
                        }}
                      >
                        <Button
                          sx={BUTTON_STYLES}
                          onClick={
                            isLoadingUpdate ? () => {} : handleUpdateInforUser
                          }
                        >
                          {isLoadingUpdate ? (
                            <CircularProgress
                              size="18px"
                              sx={{ color: "#fff" }}
                            />
                          ) : (
                            "Update"
                          )}
                        </Button>
                        <Button
                          sx={BUTTON_STYLES}
                          onClick={
                            isLoadingUpdate
                              ? () => {}
                              : handleCloseModalEditProfile
                          }
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Modal>

                  <Modal
                    open={openModalChangePassword}
                    onClose={handleCloseModalChangePassword}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={styleModal}>
                      <TextField
                        id="outlined-basic"
                        label="Old password"
                        variant="outlined"
                        fullWidth
                        sx={TEXTFIELD_STYLES}
                        value={oldPassword}
                        placeholder="Enter password..."
                        type={showOldPassword ? "text" : "password"}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="start">
                                {showOldPassword ? (
                                  <VisibilityOffIcon
                                    sx={{ cursor: "pointer" }}
                                    onClick={() =>
                                      setShowOldPassword(!showOldPassword)
                                    }
                                  />
                                ) : (
                                  <VisibilityIcon
                                    sx={{ cursor: "pointer" }}
                                    onClick={() =>
                                      setShowOldPassword(!showOldPassword)
                                    }
                                  />
                                )}
                              </InputAdornment>
                            ),
                          },
                        }}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                      <TextField
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        sx={TEXTFIELD_STYLES}
                        value={password}
                        placeholder="Enter password..."
                        type={showPassword ? "text" : "password"}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="start">
                                {showPassword ? (
                                  <VisibilityOffIcon
                                    sx={{ cursor: "pointer" }}
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                  />
                                ) : (
                                  <VisibilityIcon
                                    sx={{ cursor: "pointer" }}
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                  />
                                )}
                              </InputAdornment>
                            ),
                          },
                        }}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <TextField
                        id="outlined-basic"
                        label="Confirm password"
                        variant="outlined"
                        fullWidth
                        sx={TEXTFIELD_STYLES}
                        value={confirmPassword}
                        placeholder="Enter confirm password..."
                        type={showConfirmPassword ? "text" : "password"}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="start">
                                {showConfirmPassword ? (
                                  <VisibilityOffIcon
                                    sx={{ cursor: "pointer" }}
                                    onClick={() =>
                                      setShowConfirmPassword(
                                        !showConfirmPassword
                                      )
                                    }
                                  />
                                ) : (
                                  <VisibilityIcon
                                    sx={{ cursor: "pointer" }}
                                    onClick={() =>
                                      setShowConfirmPassword(
                                        !showConfirmPassword
                                      )
                                    }
                                  />
                                )}
                              </InputAdornment>
                            ),
                          },
                        }}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <Box
                        sx={{
                          marginTop: "20px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "fit-content",
                          position: "relative",
                          left: "calc(100% - 138px)",
                        }}
                      >
                        <Button
                          sx={BUTTON_STYLES}
                          onClick={isLoading ? () => {} : handleChangePassword}
                        >
                          Update
                        </Button>
                        <Button
                          sx={BUTTON_STYLES}
                          onClick={
                            isLoading
                              ? () => {}
                              : handleCloseModalChangePassword
                          }
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Modal>
                </Box>
              </div>
            </div>
            <Box>
              {albumProfiles ? (
                // albumWorkouts?.length > 0 ? (
                albumProfiles?.length > 0 ? (
                  <div
                    // sx={{
                    //   display: "flex",
                    //   flexWrap: "wrap",
                    //   gap: "20px",
                    // }}
                    className={stylesAlbumWorkout.albumWorkouts}
                  >
                    {/* {albumWorkouts?.map( */}
                    {albumProfiles?.map(
                      (albumWorkout) => (
                        // albumWorkout?.status === "Public" && (
                        <AlbumWorkoutContent
                          albumWorkout={albumWorkout}
                          key={albumWorkout?._id}
                        />
                      )
                      // )
                    )}
                  </div>
                ) : (
                  <p>There are no album workouts here!</p>
                )
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                  }}
                >
                  <Box sx={{ width: "330px", height: "fit-content" }}>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                  </Box>
                  <Box sx={{ width: "330px", height: "fit-content" }}>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                  </Box>
                  <Box sx={{ width: "330px", height: "fit-content" }}>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                  </Box>
                  <Box sx={{ width: "330px", height: "fit-content" }}>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          ""
        )
      ) : (
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transition: "-50%, -50%",
          }}
        />
      )}
    </Box>
  );
}

export default Profile;
