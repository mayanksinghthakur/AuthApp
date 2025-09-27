import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Menubar = () => {
  const { userData, backendURL, setuserData, setisLoggedIn } =
    useContext(AppContext);
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(backendURL + "/send-otp");
      if (response.status === 200) {
        navigate("/email-verify");
        toast.success("OTP has been sent successfully");
      } else {
        toast.error("unable to send OTP!");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  async function handleLogout() {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(backendURL + "/logout");
      if (response.status === 200) {
        setisLoggedIn(false);
        setuserData(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  //using this to remove the dropdown if we click anywhere in the screen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setdropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, []);
  });
  return (
    <>
      <nav className="nvabar bg-white px-5 py-4 d-flex justify-content-between align-content-center">
        <img src="src\assets\logo-home.png" height="40px" width="40px"></img>

        <span className="fw-bold fs-4 text-dark">Auth App</span>

        {userData ? (
          <div className="position-relative" ref={dropdownRef}>
            <div
              className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: "40px",
                height: "40px",
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => {
                setdropdownOpen((prev) => !prev);
              }}
            >
              {userData.name[0].toUpperCase()}
            </div>
            {dropdownOpen && (
              <div
                className="position-absolute shadow bg-white rounded p-2"
                style={{ top: "50px", right: 0, zIndex: 100 }}
              >
                {!userData.isAccountVerified && (
                  <div
                    className="dropdown-item py-1 px-2"
                    style={{ cursor: "pointer" }}
                    onClick={sendVerificationOtp}
                  >
                    verify Email
                  </div>
                )}

                <div
                  className="dropdown-item py-1 px-2 text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={handleLogout}
                >
                  Log Out
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => {
              navigate("/login");
            }}
          >
            login
          </button>
        )}
      </nav>
    </>
  );
};

export default Menubar;
