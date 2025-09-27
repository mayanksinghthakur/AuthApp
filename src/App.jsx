import { ToastContainer } from "react-toastify";
import "./App.css";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Menubar from "./components/Menubar.jsx";
function App() {
  return (
    <>
      <div>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/email-verify" element={<EmailVerify />}></Route>
          <Route path="/reset-password" element={<ResetPassword />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
