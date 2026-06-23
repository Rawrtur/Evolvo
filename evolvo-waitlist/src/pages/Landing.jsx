// pages/Landing.jsx
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import animationData from "../assets/animations/wave.json";
import Lottie from "lottie-react";
import "./landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="header">
        <div className="icon">E</div>
        <div>
          <h3>Welcome to Evolvo!</h3>
          <p className="sub-title">The Smart Learning App</p>
        </div>
      </div>

      <p className="text-gray-500 text-center max-w-md">
        Get early access and unlock premium faster by inviting friends.
      </p>

      <div>
        {/* <Lottie
          animationData={animationData}
          loop
          style={{ width: 300, height: 300 }}
        /> */}
      </div>

      <Button onPress={() => navigate("/signup")} title={"Join Now!"} />
    </div>
  );
}
