import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <img
        src="src/assets/userAuth.png"
        width={300}
        height={300}
        className="p-2"
      />
      <div className="p-2">
        <h1 style={{ fontSize: "40px", color: "black", fontFamily: "cursive" }}>
          Welcome {userData ? userData.name : "Developer  "} to our Auth-App
        </h1>
      </div>
      <div className="p-2">
        <button type="button" className="btn btn-success">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Header;
