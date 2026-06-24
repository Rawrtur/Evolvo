import React, { useState } from "react";
import Button from "../components/Button";
import { useSearchParams, useNavigate } from "react-router-dom";

const ThemedInput = ({
  value,
  onChange,
  placeholder,
  title,
  type = "text",
}) => {
  return (
    <div className="py-2">
      <p className="text-bold pb-2">{title}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-2xl border border-[#ea7a53] bg-white w-[90%] pl-5 py-2"
      />
    </div>
  );
};

const apiUrl = import.meta.env.VITE_API_URL;

function Code() {
  const navigate = useNavigate();

  const [code, setCode] = useState("192716");

  const handleSignup = async () => {
    const res = await fetch(`${apiUrl}/api/v1/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: localStorage.getItem("email"),
        code: code,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      console.error("error while verification");
    }

    if (data.success) {
      localStorage.setItem("token", data.data.token);
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <div className="border border-[#ea7a53] rounded-xl w-[95%] p-5">
        <h1 className="text-2xl font-bold text-center">Signup</h1>
        <ThemedInput
          value={code}
          onChange={setCode}
          title={"Enter Verification Code"}
          placeholder={"Enter Code"}
        />

        <div className="w-full flex justify-center pt-5 items-center">
          <Button
            title={"Sign Up"}
            onPress={handleSignup}
            disabled={!(code.length === 6)}
          />
        </div>
      </div>
    </div>
  );
}

export default Code;
