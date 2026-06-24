// pages/Dashboard.jsx
import { useEffect, useState } from "react";
import animationData from "../assets/animations/wave.json";
import Lottie from "lottie-react";

export default function Dashboard() {
  const [user, setUser] = useState({
    inviteCode: "12234",
    referralCount: 3,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setUser);
  }, []);

  if (!user) return <div>Loading...</div>;
  const inviteLink = `http://localhost:5173/signup?ref=${user.inviteCode}`;

  return (
    <div className="h-screen">
      <h1 className="text-2xl font-bold">Your Dashboard</h1>

      <p>Invites: {user.referralCount}</p>

      <div className="bg-gray-100 p-4 rounded-xl">
        <p className="text-sm text-gray-500">Your Invite Link:</p>
        <p className="font-mono">{inviteLink}</p>
      </div>

      {/* <div>
        <Lottie animationData={animationData} loop style={{ width: 300, height: 300 }}/>
      </div> */}

      <button
        onClick={() => navigator.clipboard.writeText(inviteLink)}
        className="px-6 py-2 bg-black text-white rounded-full"
      >
        Copy Link
      </button>
    </div>
  );
}
