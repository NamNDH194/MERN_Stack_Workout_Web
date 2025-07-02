import { BrowserRouter } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import InnerRoutes from "./pages/InnerRoutes";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <InnerRoutes />
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
