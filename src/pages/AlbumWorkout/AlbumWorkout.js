import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./AlbumWorkout.module.css";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import PublicIcon from "@mui/icons-material/Public";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import Skeleton from "@mui/material/Skeleton";

import { API_ROOT } from "../../ultilities/constants";
import { useAuthContext } from "../../hooks/useAuthContext";
import { env } from "../../config/environment";
import { useAlbumWorkoutsContext } from "../../hooks/useAlbumWorkoutsContext";
import AlbumWorkoutContent from "../../components/AlbumWorkoutContent";
import { sort } from "../../ultilities/algorithms";

function AlbumWorkout() {
  const [openModalCreateAlbum, setOpenModalCreateAlbum] = useState(false);
  const [fileUpload, setFileUpload] = useState("");
  const [typeFileUpLoad, setTypeFileUpload] = useState("");
  const [titleAlbum, setTitleAlbum] = useState("");
  const [descriptionAlbum, setDescriptionAlbum] = useState("");
  const [statusAlbum, setStatusAlbum] = useState("Public");
  const [isLoading, setIsLoading] = useState(false);
  const [optionSort, setOptionSort] = useState("Lastest");
  const [albumWorkoutDataDisplay, setAlbumWorkoutDataDisplay] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { user } = useAuthContext();
  const { albumWorkouts, dispatchAlbumWorkoutContext } =
    useAlbumWorkoutsContext();

  const styleModalCreateAlbum = {
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

  const handleCreateAlbum = async () => {
    if (!titleAlbum || !descriptionAlbum || !typeFileUpLoad || !fileUpload) {
      toast.error("Please enter complete information before submit!");
      return;
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
              title: titleAlbum,
              imgURL: imgUrl,
              description: descriptionAlbum,
              status: statusAlbum,
              imgPublicId: img_public_id,
            };
            const response = await fetch(`${API_ROOT}/v1/albumWorkout`, {
              method: "POST",
              body: JSON.stringify(albumWorkoutData),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
              },
            });
            const json = await response.json();
            if (response.ok) {
              dispatchAlbumWorkoutContext({
                type: "CREATE_ALBUM_WORKOUT",
                payload: json,
              });
              toast.success("Create album successfully!");
              setTitleAlbum("");
              setDescriptionAlbum("");
              setStatusAlbum("Public");
              setFileUpload("");
              setTypeFileUpload("");
              setOpenModalCreateAlbum(false);
              setIsLoading(false);
            }
            if (!response.ok) {
              toast.error(json.message);
              setIsLoading(false);
            }
          }
        }
        // if (typeFileUpLoad === "video") {
        //   const { timestamp: videoTimestamp, signature: videoSignature } =
        //     await getSignatureForUpload("videos");
        //   const videoUrl = await uploadFile(
        //     typeFileUpLoad,
        //     videoTimestamp,
        //     videoSignature
        //   );
        // }
      } catch (error) {
        toast.error("Something went wrong! Please try again!");
        setIsLoading(false);
      }
    }
  };

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
    if (albumWorkouts?.length > 0) {
      if (optionSort === "Lastest") {
        dispatchAlbumWorkoutContext({
          type: "SET_ALBUM_WORKOUTS",
          payload: sort([...albumWorkouts], "createdAt", 1),
        });
      }
      if (optionSort === "Oldest") {
        dispatchAlbumWorkoutContext({
          type: "SET_ALBUM_WORKOUTS",
          payload: sort([...albumWorkouts], "createdAt", 0),
        });
      }
      if (optionSort === "Likes") {
        dispatchAlbumWorkoutContext({
          type: "SET_ALBUM_WORKOUTS",
          payload: sort([...albumWorkouts], "likeNumber", 1),
        });
      }
    }
  }, [optionSort, dispatchAlbumWorkoutContext]);

  useEffect(() => {
    setAlbumWorkoutDataDisplay(albumWorkouts);
  }, [albumWorkouts]);

  useEffect(() => {
    if (searchValue) {
      setAlbumWorkoutDataDisplay(
        albumWorkouts.filter((item) =>
          item?.title
            ?.toLocaleLowerCase()
            .includes(searchValue.toLocaleLowerCase())
        )
      );
    } else {
      setAlbumWorkoutDataDisplay(albumWorkouts);
    }
  }, [searchValue, albumWorkouts]);
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Button
          startIcon={<CreateNewFolderIcon />}
          sx={{
            color: "#fff",
            backgroundColor: "#10cd98",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgb(17 122 93)",
            },
          }}
          onClick={() => setOpenModalCreateAlbum(true)}
        >
          Create album
        </Button>
        <TextField
          size="small"
          id="outlined-search"
          label="Search"
          placeholder="Search name..."
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{
            // minWidth: "120px",
            // maxWidth: "190px",
            ".MuiInputBase-input": {
              color: "#000",
            },
            "& label": {
              color: "#10cd98",
            },
            "& label.Mui-focused": {
              color: "#10cd98",
            },
            "& .MuiInputBase-root": {
              "& fieldset": {
                borderColor: "#17e6ac",
              },

              "&:hover fieldset": {
                borderColor: "#0da87d",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#10cd98",
              },
            },
          }}
        />
      </Box>

      <Modal
        open={openModalCreateAlbum}
        onClose={() => {
          if (!isLoading) {
            setTitleAlbum("");
            setDescriptionAlbum("");
            setTypeFileUpload("");
            setFileUpload("");
            setOpenModalCreateAlbum(false);
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModalCreateAlbum}>
          <Typography id="modal-modal-title" variant="h4">
            Create album
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
            sx={{ marginTop: "10px", backgroundColor: "#10cd98" }}
          >
            Upload files
            <VisuallyHiddenInput
              type="file"
              onChange={(e) => {
                if (e.target.files[0].type.split("/")[0] !== "image") {
                  toast.error("Error: Please choose image file!");
                  setFileUpload("");
                  setTypeFileUpload("");
                } else {
                  setFileUpload(e.target.files[0]);
                  setTypeFileUpload(e.target.files[0].type.split("/")[0]);
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
          <Box sx={{ overflowY: "scroll", maxHeight: "200px" }}>
            <TextareaAutosize
              aria-label="Album description"
              minRows={3}
              placeholder="Please type album description here..."
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
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
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
                value={statusAlbum === "Public" ? "Public" : "Private"}
                label="Status"
                onChange={(e) => setStatusAlbum(e.target.value)}
              >
                <MenuItem value="Public">
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <PublicIcon sx={{ color: "#17ad80" }} /> Public
                  </Box>
                </MenuItem>
                <MenuItem value="Private">
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
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
                onClick={handleCreateAlbum}
              >
                Create
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
                  setOpenModalCreateAlbum(false);
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Modal>

      <Box sx={{ width: "175px", marginTop: "30px" }}>
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
          <InputLabel id="demo-simple-select-label">Option sorting</InputLabel>
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
            value={optionSort}
            label="Option sorting"
            onChange={(e) => setOptionSort(e.target.value)}
          >
            <MenuItem value="Lastest">Latest</MenuItem>
            <MenuItem value="Oldest">Oldest</MenuItem>
            <MenuItem value="Likes">Likes</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* {albumWorkouts ? ( */}
      {albumWorkoutDataDisplay ? (
        // albumWorkouts?.length > 0 ? (
        albumWorkoutDataDisplay?.length > 0 ? (
          <div
            // sx={{
            //   display: "flex",
            //   flexWrap: "wrap",
            //   gap: "20px",
            // }}
            className={styles.albumWorkouts}
          >
            {/* {albumWorkouts?.map( */}
            {albumWorkoutDataDisplay?.map(
              (albumWorkout) =>
                albumWorkout?.status === "Public" && (
                  <AlbumWorkoutContent
                    albumWorkout={albumWorkout}
                    key={albumWorkout?._id}
                  />
                )
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
    </div>
  );
}

export default AlbumWorkout;
