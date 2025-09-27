import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const EmailVerify = () => {
  const inputref = useRef([]);
  const [loading, setLoading] = useState(false);
  const { getUserData, isLoggedIn, userData, backendURL } =
    useContext(AppContext);
  const navigate = useNavigate();

  const gradientStyle = {
    background: "linear-gradient(90deg ,#6a5af9,#8FD9FB)",
  };

  //when otp maullay entred than focus moves
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    e.target.value = value;
    if (value && index < 5) {
      inputref.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key == "Backspace" && !e.target.value && index > 0) {
      inputref.current[index - 1].focus();
    }
  };

  // for pasting otp in boxes
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).split("");

    paste.forEach((digit, i) => {
      if (inputref.current[i]) {
        inputref.current[i].value = digit;
      }
    });
    //if copied text value lenght
    const next = paste.length < 6 ? paste.length : 5;
    inputref.current[next].focus();
  };

  //making call to the api
  const handleVerify = async () => {
    const otp = inputref.current.map((input) => input.value).join("");
    if (otp.length != 6) {
      toast.error("please enter all 6 digit og OTP Sent To email");
      return;
    }
    setLoading(true);

    //calling api
    try {
      const response = await axios.post(backendURL + "/verify-otp", { otp });

      if (response.status == 200) {
        toast.success("OTP verified successfully ");
        getUserData();
        navigate("/");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("failed to Verify OTP .please Try it again");
    } finally {
      setLoading(false);
    }
  };

  //this will keep away us from getting into email-verify api and its interface if we are logged in
  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <>
      <div
        className="email-verify-container d-flex align-items-center justify-content-center vh-100 position-relative"
        style={gradientStyle}
      >
        <Link
          to="/"
          className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none"
        >
          <img src="src\assets\auth.png" height={40} width={40}></img>
          <span className="fs-4 fw-semibold text-light">Auth</span>
        </Link>

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
                ref={(el) => (inputref.current[i] = el)}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
              />
            ))}
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
      </div>
    </>
  );
};

export default EmailVerify;
