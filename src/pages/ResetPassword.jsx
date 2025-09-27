import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const inputRef = useRef([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  axios.defaults.withCredentials = true;
  const { getUserData, isLoggedIn, userData, backendURL } =
    useContext(AppContext);

  //when otp maullay entred than focus moves
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    e.target.value = value;
    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key == "Backspace" && !e.target.value && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  // for pasting otp in boxes
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).split("");

    paste.forEach((digit, i) => {
      if (inputRef.current[i]) {
        inputRef.current[i].value = digit;
      }
    });
    //if copied text value lenght
    const next = paste.length < 6 ? paste.length : 5;
    inputRef.current[next].focus();
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    //making setLoading to true
    setLoading(true);
    try {
      // passing emai in the query
      const response = await axios.post(
        backendURL + "/send-reset-otp?email=" + email
      );
      if (response.status === 200) {
        toast.success("password reset OTP sent successfully");
        setIsEmailSent(true);
      } else {
        toast.error("something went wrong, please try again");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    const otp = inputRef.current.map((input) => input.value).join("");
    if (otp.length !== 6) {
      toast.error("please enter 6 digits");
      return;
    }
    setOtp(otp);
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(backendURL + "/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (response.status === 200) {
        toast.success("password Reset Successfull");
        navigate("/login");
      } else {
        toast.error("something went wrong !");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div
        className="email-verify-container d-flex align-items-center justify-content-center vh-100 position-relative"
        style={{
          background: "linear-gradient(90deg ,#6a5af9,#8FD9FB)",
          border: "none",
        }}
      >
        <Link
          to="/"
          className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none"
        >
          <img
            src="src\assets\logo-home.png"
            alt="logo"
            height={50}
            width={50}
          ></img>
          <span className="fs-1 fw-semibold link-dark ">Auth</span>
        </Link>
        {/* reset password  card*/}
        {!isEmailSent && (
          <div
            className="rounded-4 p-5 text-center bg-white"
            style={{ width: "30%", maxWidth: "400px" }}
          >
            <h4 className="mb-2">Reset Password</h4>
            <p className="mb-4">Enter your registered email address</p>

            <form onSubmit={onSubmitEmail}>
              <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
                <span className="input-group-text bg-transparent border-0 ps-4">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control bg-transparent border-0 text-black ps-1 pe-4 rounded-end "
                  placeholder="Enter your email address"
                  style={{ height: "50px" }}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                ></input>
              </div>
              <button
                className="btn btn-primary w-100 py-2"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading" : " Submit"}
              </button>
            </form>
          </div>
        )}
        {/* otp card */}
        {!isOtpSubmitted && isEmailSent && (
          <div
            className="p-5 rounded-4 shadow"
            style={{ width: "400px", backgroundColor: "white" }}
          >
            <h4 className="text-center fw-bold mb-2 ">Email-verify</h4>
            <p className="text-center  mb-4">
              Enter the 6 digit code sent to your email
            </p>
            <div className=" d-flex justify-content-between gap-2 mb-4 text-center text-white-50 mb-2">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="form-control text-center fs-4 otp-input"
                  ref={(el) => (inputRef.current[i] = el)}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={handlePaste}
                />
              ))}

              {/* {new password form} */}
            </div>

            {/* onclick of this button we have to send otp */}
            <button
              className="btn btn-primary w-w-100 fw-semibold"
              disabled={loading}
              onClick={handleVerify}
            >
              {loading ? "verifying..." : "verify email"}
            </button>
          </div>
        )}

        {isOtpSubmitted && isEmailSent && (
          <div
            className="rounded-4 text-center bg-white"
            style={{ width: "100%", maxWidth: "400px" }}
          >
            <h4>New Password</h4>
            <p className="mb-4">Enter the new password below</p>
            <form onSubmit={onSubmitNewPassword}>
              <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
                <span className="input-group-text bg-transparent border-0 ps-4">
                  <i className="bi bi-person-fill-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control bg-transparent border-0 ps-1 pe-4 rounded-end m-3"
                  placeholder="Enter reset password"
                  onClick={(e) => setNewPassword(e.target.value)}
                  required
                ></input>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-50 mb-3"
                disabled={loading}
              >
                {loading ? "Loading" : " Submit"}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default ResetPassword;
