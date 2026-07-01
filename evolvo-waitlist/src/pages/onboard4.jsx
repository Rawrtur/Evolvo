import Progress from "../components/progress";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Carousel from "../components/Caroussel";
import { motion } from "framer-motion";
import { useEffect } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

function Onboard4() {
  useEffect(() => {
    fetch(`${apiUrl}/api/v1/monitors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "onboard4",
      }),
    });
  }, []);

  const navigate = useNavigate();

  return (
    <div className="w-full">
      <Progress page={4} totalPages={5} />
      <h1 className="font-bold text-center pt-5 text-2xl text-[#ea7a53]">
        Explore the Features
      </h1>
      <motion.div
        className="p-3 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <Carousel>
          <div className="p-5">
            <h3 className="font-bold text-2xl text-center">
              Spaced Repetition
            </h3>
            <p className="text-center">
              Never repeat yourself unnecessarily again.
            </p>
            <img src="/images/spaced.png" alt="Spaced Repetition" />
            <p className="text-center py-5">
              Our study plans show you exactly the right time to revise.
            </p>
          </div>

          <div className="p-5">
            <h3 className="font-bold text-2xl text-center">Pomodoro</h3>
            <p className="text-center">
              Study with concentration. 25 minutes of focus. 5-minute break.
            </p>
            <img src="/images/pomodoro.png" alt="pomodoro" />
            <p className="text-center py-5">
              More concentration. Fewer distractions.
            </p>
          </div>

          <div className="p-5">
            <h3 className="font-bold text-2xl text-center">KI Tutor</h3>
            <p className="text-center">
              Understand rather than learn by heart. Explain a topic relating to
              AI.
            </p>
            <img src="/images/tutor.png" alt="ki tutor" />
            <p className="text-center py-5">
              She spots where you’re struggling to understand and helps you out.
            </p>
          </div>

          <div className="p-5">
            <h3 className="font-bold text-2xl text-center">KI Questions</h3>
            <p className="text-center">
              The AI automatically generates perfect revision questions.
            </p>
            <img src="/images/questions.png" alt="ki questions" />
            <p className="text-center py-5">
              You no longer need to write flashcards.
            </p>
          </div>
        </Carousel>
      </motion.div>
      <motion.div
        className="w-full p-5 flex justify-center items-center pb-15"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <Button
          title={"Continue"}
          onPress={() => navigate("/onboard/5")}
          innerPadding={80}
        />
      </motion.div>
    </div>
  );
}

export default Onboard4;
