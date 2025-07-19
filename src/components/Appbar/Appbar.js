import React from "react";
import styles from "./Appbar.module.css";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditNoteIcon from "@mui/icons-material/EditNote";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { useNavigate } from "react-router-dom";

function Appbar() {
  const navigate = useNavigate();
  const handleMouseFocus = (e) => {
    if (e.target.tagName.toLocaleUpperCase() === "DIV") {
      const underBar = e.target.querySelector("div");
      if (underBar) {
        underBar.classList.remove(styles.shrinkBar);
        underBar.classList.add(styles.growBar);
      }
    }
    if (e.target.tagName.toLocaleUpperCase() === "P") {
      const underBar = e.target.nextElementSibling;
      if (underBar) {
        underBar.classList.remove(styles.shrinkBar);
        underBar.classList.add(styles.growBar);
      }
    }

    if (e.target.tagName.toLocaleUpperCase() === "PATH") {
      const underBar = e.target.parentNode.parentNode.nextElementSibling;
      if (underBar) {
        underBar.classList.remove(styles.shrinkBar);
        underBar.classList.add(styles.growBar);
      }
    }

    if (e.target.tagName.toLocaleUpperCase() === "SVG") {
      const underBar = e.target.parentNode.nextElementSibling;
      if (underBar) {
        underBar.classList.remove(styles.shrinkBar);
        underBar.classList.add(styles.growBar);
      }
    }
  };

  const handleMouseLeave = (e) => {
    if (e.target.tagName === "DIV") {
      const underBar = e.target.querySelector("div");
      if (underBar) {
        underBar.classList.remove(styles.growBar);
        underBar.classList.add(styles.shrinkBar);
      }
    }
    if (e.target.tagName === "P") {
      const underBar = e.target.nextElementSibling;
      if (underBar) {
        underBar.classList.remove(styles.growBar);
        underBar.classList.add(styles.shrinkBar);
      }
    }
    if (e.target.tagName.toLocaleUpperCase() === "PATH") {
      const underBar = e.target.parentNode.parentNode.nextElementSibling;
      if (underBar) {
        underBar.classList.remove(styles.growBar);
        underBar.classList.add(styles.shrinkBar);
      }
    }
    if (e.target.tagName.toLocaleUpperCase() === "SVG") {
      const underBar = e.target.parentNode.nextElementSibling;
      if (underBar) {
        underBar.classList.remove(styles.growBar);
        underBar.classList.add(styles.shrinkBar);
      }
    }
  };
  return (
    <Box className={styles.appbarContainer}>
      <Box
        className={styles.appbarElement}
        onMouseEnter={handleMouseFocus}
        onMouseLeave={handleMouseLeave}
        onClick={() => navigate("/")}
      >
        <Typography sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <EditNoteIcon /> Workout note
        </Typography>
        <div className={styles.underBar}></div>
      </Box>
      <Box
        className={styles.appbarElement}
        onMouseEnter={handleMouseFocus}
        onMouseLeave={handleMouseLeave}
        onClick={() => navigate("/public_album_workouts")}
      >
        <Typography sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <LibraryBooksIcon /> Public album workouts
        </Typography>
        <div className={styles.underBar}></div>
      </Box>
      <Box
        className={styles.appbarElement}
        onMouseEnter={handleMouseFocus}
        onMouseLeave={handleMouseLeave}
        onClick={() => navigate("/storage")}
      >
        <Typography sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <BookmarksIcon /> Storage
        </Typography>
        <div className={styles.underBar}></div>
      </Box>
    </Box>
  );
}

export default Appbar;
