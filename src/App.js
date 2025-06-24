import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { Bounce, ToastContainer } from "react-toastify";
import Auth from "./pages/Auth";
import { useAuthContext } from "./hooks/useAuthContext";
import AppBar from "./components/Appbar/Appbar";
import AlbumWorkout from "./pages/AlbumWorkout/AlbumWorkout";
import Clock from "./pages/Clock";
function App() {
  const { user } = useAuthContext();
  // const navigate = useNavigate();
  // if (!user) {
  //   navigate("/login");
  // }
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        {user ? <AppBar /> : ""}

        <div className="pages">
          {/* {user ? <Navigate to={"/"} /> : <Navigate to={"/login"} />} */}
          {user ? (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/public_album_workouts" element={<AlbumWorkout />} />
              <Route path="/clock" element={<Clock />} />
              <Route path="/login" element={<Auth />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/login" element={<Auth />} />
            </Routes>
          )}
        </div>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
