import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";

import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

const Navbar = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openAvatar = Boolean(anchorEl);
  const { dispatch, user } = useAuthContext();
  const { dispatchWorkoutContext } = useWorkoutsContext();
  const navigate = useNavigate();
  const handleLogOut = () => {
    setAnchorEl(null);
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    dispatchWorkoutContext({ type: "LOGOUT" });
    navigate("/login");
  };
  return (
    <>
      <header style={{ backgroundColor: "#27c296" }}>
        <div className="container">
          <Link to="/">
            <h1 className="text-with-background-image">Workout Buddy</h1>
          </Link>
          {user ? (
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <p style={{ fontSize: "23px" }}>{user.userName}</p>

              <div>
                <Avatar
                  id="Avatar-img"
                  aria-controls={openAvatar ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openAvatar ? "true" : undefined}
                  alt="Cindy Baker"
                  src={user?.avatarImg}
                  sx={{ cursor: "pointer" }}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                />
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={openAvatar}
                  onClose={() => setAnchorEl(null)}
                  slotProps={{
                    list: {
                      "aria-labelledby": "Avatar-img",
                    },
                  }}
                >
                  <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
                  <MenuItem onClick={() => setAnchorEl(null)}>
                    My account
                  </MenuItem>
                  <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                </Menu>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
