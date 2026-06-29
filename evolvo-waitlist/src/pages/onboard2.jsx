import Progress from "../components/progress";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../assets/animations/wave.json";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  School,
  University,
  File,
  Languages,
  Menu,
  BadgeCheck,
  BaggageClaim,
} from "lucide-react";

function Onboard2() {
  const navigate = useNavigate();

  const answers = [
    { icon: File, text: "Passing exams" },
    { icon: Languages, text: "Learn a new language" },
    { icon: University, text: "University" },
    { icon: School, text: "School" },
    { icon: BadgeCheck, text: "Certificates" },
    { icon: BaggageClaim, text: "Job" },
    { icon: Menu, text: "Other" },
  ];

  return (
    <div className="w-full">
      <Progress page={2} totalPages={5} />
      <motion.div
        className="text-center font-bold px-10 pt-10 pb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        What would you like to achieve?
      </motion.div>

      <div className="p-5">
        <div className="p-5 flex-row w-full bg-white rounded-3xl border border-[#ea7a53]">
          {answers.map((text, key) => {
            const Icon = text.icon;
            return (
              <motion.button
                key={key}
                onClick={() => navigate("/onboard/3")}
                className="py-3 flex border-b border-gray-300 font-semibold w-full justify-start items-center gap-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * key, duration: 0.8 }}
              >
                <div className="bg-[#ea7a53] p-2 rounded-xl">
                  <Icon />
                </div>
                {text.text}
              </motion.button>
            );
          })}
        </div>
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

export default Onboard2;
