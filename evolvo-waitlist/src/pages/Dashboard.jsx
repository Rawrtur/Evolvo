// pages/Dashboard.jsx
import { useEffect, useState } from "react";
import animationData from "../assets/animations/wave.json";
import loadingAnimation from "../assets/animations/loading.json";
import { Player } from "@lottiefiles/react-lottie-player";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [above, setAbove] = useState([]);
  const [below, setBelow] = useState([]);
  const [top, setTop] = useState([]);
  const [rank, setRank] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      const res = await fetch(
        `${apiUrl}/api/v1/users/leaderboard/${user._id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      const data = await res.json();

      if (!res.ok) {
        console.error("errrrr");
      }

      if (data.success) {
        setAbove(data.above);
        setBelow(data.below);
        setTop(data.top);
        setRank(data.rank);
      }
    };
    fetchData();
  }, []);

  if (!user) return (
  <div>
    <Player
          autoplay
          loop
          src={loadingAnimation}
          style={{ width: 250, height: 250 }}
        />
  </div>
);

  const inviteLink = `http://localhost:5173/signup?ref=${user._id}`;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Your Dashboard</h1>
      <p>Invites: {user.invited}</p>
      <div className="bg-gray-100 p-4 rounded-xl">
        <p className="text-sm text-gray-500">Your Invite Link:</p>
        <p className="font-mono">{inviteLink}</p>
      </div>
      <div>
        <Player
          autoplay
          loop
          src={animationData}
          style={{ width: 150, height: 150 }}
        />
      </div>
      <button
        onClick={() => navigator.clipboard.writeText(inviteLink)}
        className="px-6 py-2 bg-black text-white rounded-full"
      >
        Copy Link
      </button>
      <div className="w-full py-10 flex justify-center">
        <div className="w-[95%] flex-col items-center justify-center rounded-xl overflow-hidden">
          {top.map((us, key) => (
            <div
              className={`flex justify-between border-b py-3 px-5 ${key + 1 === rank ? "text-[#ea7a53] font-bold bg-gray-200" : "bg-white"}`}
            >
              <p>{key + 1}</p>
              <p>
                {key === 0 && "👑  "}
                {rank === key + 1 ? us.name : us.name[0]}
                {rank !== key + 1 && "•••••"}
                {key === 0 && "  👑"}
              </p>
              <p>{us.invited}</p>
            </div>
          ))}
          {!(rank === 4 || rank === 5 || rank === 6 || rank === 7) &&
            rank !== 3 && (
              <div className="flex justify-center border-b py-3 px-5 bg-white">
                . . .
              </div>
            )}
          {rank === 5 && (
            <div className="flex justify-between border-b py-3 px-5 bg-white">
              <p>4</p>
              <p>{above[2].name}</p>
              <p>{above[2].invited}</p>
            </div>
          )}
          {rank === 6 &&
            above.slice(-2).map((us, key) => (
              <div className="flex justify-between border-b py-3 px-5 bg-white">
                <p>{rank - (2 - key)}</p>
                <p>{us.name}</p>
                <p>{us.invited}</p>
              </div>
            ))}
          {rank > 6 &&
            above.slice(3 - rank).map((us, key) => (
              <div className="flex justify-between border-b py-3 px-5 bg-white">
                <p>{rank - (3 - key)}</p>
                <p>{us.name}</p>
                <p>{us.invited}</p>
              </div>
            ))}
          {rank > 3 && (
            <div className="flex justify-between border-b py-3 px-5 bg-gray-200 font-bold text-[#ea7a53]">
              <p>{rank}</p>
              <p>{user.name}</p>
              <p>{user.invited}</p>
            </div>
          )}
          {rank > 2 &&
            below.map((us, key) => (
              <div className="flex justify-between border-b py-3 px-5 bg-white">
                <p>{key + 1 + rank}</p>
                <p>{us.name}</p>
                <p>{us.invited}</p>
              </div>
            ))}
          {rank > 3 && (
            <div className="flex justify-center border-b py-3 px-5 bg-white">
              . . .
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
