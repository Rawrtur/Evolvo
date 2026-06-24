// pages/Signup.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";

const apiUrl = import.meta.env.VITE_API_URL;

const ThemedInput = ({ value, onChange, placeholder, title }) => {
  return (
    <div className="py-2">
      <p className="text-bold pb-2">{title}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-2xl border border-[#ea7a53] bg-white w-[90%] pl-5 py-2"
      />
    </div>
  );
};

const RequirementItem = ({ label, isValid }) => {
  return (
    <div className="flex items-center gap-2 py-1">
      <span
        className={`transition-all duration-300 text-lg ${
          isValid ? "text-green-500 scale-110" : "text-red-500"
        }`}
      >
        {isValid ? "✓" : "✕"}
      </span>

      <span
        className={`text-sm ${isValid ? "text-green-700" : "text-red-600"}`}
      >
        {label}
      </span>
    </div>
  );
};

export default function Signup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [ref, setRef] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validations = {
    nameValid: name.length >= 2 && name.length <= 15,
    emailValid: isEmailValid(email),
    passwordLengthValid: password.length >= 6,
    passwordsMatch: password === confirmPassword && password.length > 0,
  };

  const allValid = Object.values(validations).every(Boolean);

  useEffect(() => {
    const referral = searchParams.get("ref");
    if (referral) setRef(referral);
  }, []);

  const handleSignup = async () => {
    if (!allValid) return;
    const res = await fetch(`${apiUrl}/api/v1/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
        ref: ref,
      }),
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <div className="border border-[#ea7a53] rounded-xl w-[95%] p-5">
        <h1 className="text-2xl font-bold text-center">Signup</h1>
        <ThemedInput
          value={name}
          onChange={setName}
          title={"Name"}
          placeholder={"Enter you name"}
        />
        <ThemedInput
          value={email}
          onChange={setEmail}
          title={"Email"}
          placeholder={"Enter you email"}
        />
        <ThemedInput
          value={password}
          onChange={setPassword}
          title={"Password"}
          placeholder={"Enter you password"}
        />
        <ThemedInput
          value={confirmPassword}
          onChange={setConfirmPassword}
          title={"Confirm Password"}
          placeholder={"confirm password"}
        />
        <div className="mt-4 border-t pt-4">
          <p className="font-semibold mb-2">Requirements</p>

          <RequirementItem
            label="Name must be 2–15 characters"
            isValid={validations.nameValid}
          />

          <RequirementItem
            label="Valid email format"
            isValid={validations.emailValid}
          />

          <RequirementItem
            label="Password must be at least 6 characters"
            isValid={validations.passwordLengthValid}
          />

          <RequirementItem
            label="Passwords must match"
            isValid={validations.passwordsMatch}
          />
        </div>
        <div className="w-full flex justify-center pt-5 items-center">
          <Button
            title={"Sign Up"}
            onPress={handleSignup}
            disabled={!allValid}
          />
        </div>
      </div>
    </div>
  );
}
