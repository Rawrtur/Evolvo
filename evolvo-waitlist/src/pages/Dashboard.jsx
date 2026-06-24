// pages/Dashboard.jsx
import { useEffect, useState } from "react";
import animationData from "../assets/animations/wave.json";
import Lottie from "lottie-react";

export default function Dashboard() {

  localStorage.setItem("user",JSON.stringify({
      "_id": "6a3c5626454d6533c46969c3",
      "name": "Artur",
      "email": "test@web.de",
      "password": "$2b$10$kOrQ3ZY.ZwnQQT5OdTl3KuqejyWchq5QwMM.cqW7dWpNwSqLb4sZa",
      "verified": true,
      "verificationCode": null,
      "verificationExpiresIn": "2026-06-25T00:41:50.838Z",
      "invited": 0,
      "createdAt": "2026-06-24T22:11:50.845Z",
      "updatedAt": "2026-06-24T22:12:06.636Z",
      "__v": 0
    }))
  const user = JSON.parse(localStorage.getItem("user"));


  

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    
    // fetch("http://localhost:3000/me", {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // })
    //   .then((res) => res.json())
    //   .then(setUser);
  }, []);

  if (!user) return <div>Loading...</div>;
  const inviteLink = `http://localhost:5173/signup?ref=${user._id}`;

  return (
    <div className="h-screen">
      <h1 className="text-2xl font-bold">Your Dashboard</h1>

      <p>Invites: {user.invited}</p>

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
