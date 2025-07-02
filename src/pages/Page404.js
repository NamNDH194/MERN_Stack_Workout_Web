import Button from "@mui/material/Button";
import React from "react";

import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { useNavigate } from "react-router-dom";

function Page404() {
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#fff",
          position: "absolute",
          top: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h1
            style={{
              maxWidth: "fit-content",
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
            }}
          >
            404 Not Found!
          </h1>
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/image_404.png`}
            alt="404_image"
            style={{
              width: "80%",
              maxWidth: "fit-content",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <Button
            startIcon={<DirectionsWalkIcon />}
            sx={{
              width: "250px",
              marginLeft: "auto",
              marginRight: "auto",
              backgroundColor: "#10cd98",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgb(17 122 93)",
              },
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            Want to go home ?
          </Button>
        </div>
      </div>
    </>
  );
}

export default Page404;
