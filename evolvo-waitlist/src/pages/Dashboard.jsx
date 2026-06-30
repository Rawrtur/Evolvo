/* eslint-disable react-hooks/rules-of-hooks */
// pages/Dashboard.jsx
import { useEffect, useState } from "react";
import animationData from "../assets/animations/wave.json";
import loadingAnimation from "../assets/animations/loading.json";
import { Player } from "@lottiefiles/react-lottie-player";
import InviteBox from "../components/InviteBox";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

function DeleteButton({ onConfirm }) {
  const handleClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to carry out this action?",
    );

    if (confirmed) {
      onConfirm();
    }
  };

  return (
    <button onClick={handleClick} className="text-gray-500 underline">
      Löschen
    </button>
  );
}

const displayName = (key, name, rank) => {
  return `${key === 0 ? "👑  " : ""}${key + 1 === rank ? name : name[0]}${key + 1 !== rank ? "•••••" : ""}${key === 0 ? "  👑" : ""}`;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [above, setAbove] = useState([]);
  const [below, setBelow] = useState([]);
  const [top, setTop] = useState([]);
  const [rank, setRank] = useState(null);
  const [invited, setInvited] = useState(null);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    navigate("/");
  };

  const leave = async () => {
    try {

      const res = await fetch(`${apiUrl}/api/v1/users/${user._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("error while delete user");
      }

      if (data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("email");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // const token = localStorage.getItem("token");

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
        setInvited(data.invited);
      }
    };
    fetchData();
  }, []);

  if (!user)
    return (
      <div>
        <Player
          autoplay
          loop
          src={loadingAnimation}
          style={{ width: 250, height: 250 }}
        />
      </div>
    );
  const inviteLink = `http://192.168.2.171:5173/signup?ref=${user._id}`;

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-center text-[#ea7a53] py-10">
        Your Dashboard
      </h1>
      <div className="p-5">
        <p>Invites: {invited}</p>
        <InviteBox inviteLink={inviteLink} />
        <div>
          <Player
            autoplay
            loop
            src={animationData}
            style={{ width: 150, height: 150 }}
          />
        </div>
      </div>
      <div className="w-full py-10 flex justify-center">
        <div className="w-[95%] flex-col items-center justify-center rounded-xl overflow-hidden">
          {top.map((us, key) => (
            <div
            key={key}
              className={`flex justify-between border-b py-3 px-5 ${user._id === us._id ? "text-[#ea7a53] font-bold bg-gray-200" : "bg-white"}`}
            >
              <p>{key + 1}</p>
              <p>{displayName(key, us.name, rank)}</p>
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
              <p>{displayName(1, above[2].name, rank)}</p>
              <p>{above[2].invited}</p>
            </div>
          )}
          {rank === 6 &&
            above.slice(-2).map((us, key) => (
              <div  key={key} className="flex justify-between border-b py-3 px-5 bg-white">
                <p>{rank - (2 - key)}</p>
                <p>{displayName(1, us.name, rank)}</p>
                <p>{us.invited}</p>
              </div>
            ))}
          {rank > 6 &&
            above.slice(3 - rank).map((us, key) => (
              <div key={key} className="flex justify-between border-b py-3 px-5 bg-white">
                <p>{rank - (3 - key)}</p>
                <p>{displayName(key + 1, us.name, rank)}</p>
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

      <div className="p-5 w-full flex justify-between items-center">
        <button className="text-gray-500 underline" onClick={logout}>
          Log out
        </button>
        <DeleteButton onConfirm={leave} />
      </div>
    </div>
  );
}
