// pages/Signup.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Signup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [ref, setRef] = useState(null);

  useEffect(() => {
    const referral = searchParams.get("ref");
    if (referral) setRef(referral);
  }, []);

  const handleSignup = async () => {
    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@test.com",
        password: "123456",
        ref: ref,
      }),
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);
    navigate("/dashboard");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Signup</h1>

      {ref && (
        <p className="text-green-600">
          Referred by: {ref}
        </p>
      )}

      <button
        onClick={handleSignup}
        className="px-6 py-2 bg-blue-600 text-white rounded-full"
      >
        Create Account
      </button>
    </div>
  );
}

