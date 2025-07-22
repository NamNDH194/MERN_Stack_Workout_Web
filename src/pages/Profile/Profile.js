import Avatar from "@mui/material/Avatar";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAlbumProfilesContext } from "../../hooks/useAlbumProfilesContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { API_ROOT } from "../../ultilities/constants";
import { toast } from "react-toastify";
import styles from "./Profile.module.css";
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
  const { user } = useAuthContext();
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseModalEditProfile = () => {
    if (!isLoading) {
      setUserName(userData?.userName);
      setUserAvatarImg(userData?.avatarImg);
      setFileUpload("");
      setTypeFileUpload("");
      setOpenModalEditProfile(false);
    }
  };

  const handleCloseModalChangePassword = () => {
    if (!isLoading) {
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
        console.log(this);
        setUserAvatarImg(this.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUpdateInforUser = async () => {
    if (userName !== userData?.userName || (fileUpload && typeFileUpLoad)) {
      console.log("update");
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
      console.log("change password");
    }
  };

  useEffect(() => {
    if (albumProfiles?.length > 0 && userData) {
      console.log(albumProfiles);
      console.log(userData);
      console.log(format(new Date(userData?.created), "dd/MM/yyyy"));
    }
  }, [albumProfiles, userData]);

  return (
    <Box sx={{ marginX: "10%" }}>
      {!isLoading ? (
        userData && albumProfiles?.length > 0 ? (
          <div className={styles.header}>
            <Avatar
              aria-label="recipe"
              src={userData?.avatarImg}
              sx={{
                cursor: userData?.avatarImg ? "pointer" : "auto",
                width: 180,
                height: 180,
              }}
              onClick={
                userData?.avatarImg
                  ? () => {
                      alert("OK");
                    }
                  : () => {}
              }
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
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <EditIcon sx={{ color: "#10cd98" }} /> Edit Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => setOpenModalChangePassword(true)}
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
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
                        onClick={isLoading ? () => {} : handleUpdateInforUser}
                      >
                        Update
                      </Button>
                      <Button
                        sx={BUTTON_STYLES}
                        onClick={
                          isLoading ? () => {} : handleCloseModalEditProfile
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
                                  onClick={() => setShowPassword(!showPassword)}
                                />
                              ) : (
                                <VisibilityIcon
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => setShowPassword(!showPassword)}
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
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                />
                              ) : (
                                <VisibilityIcon
                                  sx={{ cursor: "pointer" }}
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
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
                          isLoading ? () => {} : handleCloseModalChangePassword
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
