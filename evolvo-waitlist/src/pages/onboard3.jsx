import React from "react";
import Progress from "../components/progress";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import Button from "../components/Button";
import { motion } from "framer-motion";

function Onboard3() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <Progress totalPages={5} page={3} />

      <div className="p-5 flex flex-col">
        <span className="text-[#ea7a53] py-3 text-sm">Just imagine . . .</span>
        <span className="font-bold text-2xl">Your learning.</span>
        <span className="font-bold text-2xl">Simple.</span>
        <span className="font-bold text-2xl">Effective.</span>
        <div className="w-full py-10 flex flex-col gap-5">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="bg-[#ea7a53] h-8 w-8 items-center justify-center flex rounded-full">
              <Check color="white" />
            </div>
            <div>
              <span className="font-bold">The app shows you</span>
              <p>exactly what you’re supposed to learn today</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="bg-[#ea7a53] h-8 w-8 items-center justify-center flex rounded-full">
              <Check color="white" />
            </div>
            <div>
              <span className="font-bold">You’ll learn in a focused way</span>
              <p>in short, effective time slots</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="bg-[#ea7a53] h-8 w-8 items-center justify-center flex rounded-full">
              <Check color="white" />
            </div>
            <div>
              <span className="font-bold">You really do understand</span>
              <p>rather than just learning by heart</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center p-5 gap-3 bg-orange-300/80 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div>Retain more, feel less stress. More time for yourself</div>
          </motion.div>
        </div>
        <div className="w-full flex items-center justify-center">
          <Button
            onPress={() => navigate("/onboard/4")}
            title={"Continue"}
            innerPadding={80}
          />
        </div>
      </div>
    </div>
  );
}

export default Onboard3;
