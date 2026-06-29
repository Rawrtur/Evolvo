import React from "react";
import Progress from "../components/progress";
import animationData from "../assets/animations/wave.json";
import { Player } from "@lottiefiles/react-lottie-player";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Onboard5() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <Progress page={5} totalPages={5} />
      <div className="flex flex-col justify-center items-center pb-20 px-5">
        <motion.h1
          className="font-bold text-center py-10 text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Sign up to secure Premium access and be notified when the app is
          released!
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Player
            autoplay
            loop
            src={animationData}
            style={{ width: 300, height: 300 }}
          />
        </motion.div>
        <Button
          innerPadding={80}
          title={"Register!"}
          onPress={() => navigate("/signup")}
        />
        {/* <div className="h-30"></div> */}
      </div>
    </div>
  );
}

export default Onboard5;
