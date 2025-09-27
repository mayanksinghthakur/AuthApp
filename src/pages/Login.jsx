import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios, { Axios } from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
const Login = () => {
  const [isCreatedAccount, setIsCreatedAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { backendURL, setisLoggedIn, getUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const gradientStyle = {
    background: "linear-gradient(90deg ,#6a5af9,#8FD9FB)",
  };

  const divStyle = {
    position: "absolute",
    top: "20px",
    left: "30px",
    display: "flex",
    alignItems: "center",
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    setLoading(true);
    try {
      if (isCreatedAccount) {
        // Register API (existing code)
        const response = await axios.post(`${backendURL}/register`, {
          name,
          email,
          password,
        });
        if (response.status == 201) {
          navigate("/");
          toast.success("Account created successfully");
        } else {
          toast.error("Email already exists");
        }
      } else {
        const response = await axios.post(`${backendURL}/login`, {
          email,
          password,
        });
        if (response.status == 200) {
          setisLoggedIn(true);
          //will retrieve the profile value and update it
          getUserData();
          navigate("/");
        } else {
          toast.error("Email or Password is incorrect");
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div
        className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
        style={gradientStyle}
      >
        <div style={divStyle}>
          <Link
            to="/"
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              fontWeight: "bold",
              fontSize24: "24px",
              textDecoration: "none",
            }}
          >
            <img src="src\assets\logo-home.png" height={32} width={32}></img>
            <span className="fw-bold fs-4 text-light">Auth</span>
          </Link>
        </div>

        <div
          className="card p-4"
          style={{ maxWidth: "400px", width: "100%", height: "500px" }}
        >
          <h2 className="text-center mb-4">
            {isCreatedAccount ? "Create Account" : "Login"}
          </h2>
          <form onSubmit={onSubmitHandler}>
            {isCreatedAccount && (
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  email
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="form-control"
                  placeholder="Enter full Name"
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                ></input>
              </div>
            )}
            <div className="mb-3">
              <label
                htmlFor="email"
                className="form-label"
                style={{ marginTop: "20px" }}
              >
                email
              </label>
              <input
                type="text"
                id="email"
                className="form-control"
                placeholder="Enter email"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              ></input>
            </div>

            <div className="mb-3">
              <label
                htmlFor="password"
                className="form-label"
                style={{ marginTop: "20px" }}
              >
                password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="*******"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              ></input>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <Link to="/reset-password" className="text-decoration-none">
                Forgot password
              </Link>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {/* button will be disabled when loading is true */}
              {loading ? "loading" : isCreatedAccount ? "Sign Up" : "Login"}
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="mb-0">
              {isCreatedAccount ? (
                <>
                  Account exists?
                  <span
                    className="text-decoration-underline "
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsCreatedAccount(false)}
                  >
                    Login Here
                  </span>
                </>
              ) : (
                <>
                  Dont't have an Account?{"  "}
                  <span
                    className="text-decoration-underline "
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsCreatedAccount(true)}
                  >
                    sign up
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
