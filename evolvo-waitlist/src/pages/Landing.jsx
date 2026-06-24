// pages/Landing.jsx
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import animationData from "../assets/animations/wave.json";
import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="w-full">
      <motion.div
        className="w-full items-center justify-center flex gap-4 pt-10 px-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="text-white font-bold bg-[#ea7a53] w-10 h-10 items-center justify-center flex rounded-tl-xl rounded-br-xl text-2xl">
          E
        </div>
        <div>
          <h3 className="font-bold text-xl">Welcome to Evolvo!</h3>
          <p className="text-gray-700">The Smart Learning App</p>
        </div>
      </motion.div>

      <motion.div
        className="w-full justify-center flex-row items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <p className="text-center max-w-md pt-10">
          Get early access and unlock premium faster by inviting friends.
        </p>
        <Player
          autoplay
          loop
          src={animationData}
          style={{ width: 150, height: 150 }}
        />
        <div className="w-full items-center justify-center flex mb-20">
          <Button onPress={() => navigate("/signup")} title={"Join Now!"} />
        </div>
      </motion.div>
    </div>
  );
}
