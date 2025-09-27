import Header from "../components/Header.jsx";
import Menubar from "../components/Menubar.jsx";

const Home = () => {
  const gradientStyle = {
    background: "linear-gradient(90deg ,#6a5af9,#8FD9FB)",
  };
  return (
    <>
      <div
        className="flex flex-column item-center justify-content-center min-vh-100"
        style={gradientStyle}
      >
        <Menubar />
        <Header />
      </div>
    </>
  );
};

export default Home;
