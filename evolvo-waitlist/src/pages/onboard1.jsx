import {useEffect} from "react";
import Progress from "../components/progress";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../assets/animations/wave.json";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const apiUrl = import.meta.env.VITE_API_URL;

function Onboard1() {

  useEffect(()=>{
    fetch(`${apiUrl}/api/v1/monitors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "onboard1",
      })
    })
  },[])

  const navigate = useNavigate();

  const answers = [
    "I forget what I’ve learnt quickly",
    "I keep putting off studying",
    "I never know where to start",
    "I’m spending too much time studying",
    "I’d like to study more efficiently",
  ];

  return (
    <div className="w-full">
      <Progress page={1} totalPages={5} />
      <motion.div
        className="text-center font-bold px-10 pt-10 pb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Which of the following best describes you?
      </motion.div>

      <div className="p-5">
        {answers.map((text, key) => (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: key * 0.2, duration: 0.8 }}
            key={key}
            className="flex py-2 justify-start items-center gap-3"
            onClick={() => navigate("/onboard/2")}
          >
            <div className="border border-[#ea7a53] rounded-full h-10 w-10 bg-white border-2"></div>
            {text}
          </motion.button>
        ))}
      </div>

      <Player
        autoplay
        loop
        src={animationData}
        style={{ width: 150, height: 150 }}
      />
    </div>
  );
}

export default Onboard1;
