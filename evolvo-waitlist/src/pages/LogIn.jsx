import { useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

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

function LogIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("test@web.de");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState(null);

  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validations = {
    emailValid: isEmailValid(email),
    passwordLengthValid: password.length >= 6,
  };

  const allValid = Object.values(validations).every(Boolean);

  const handleSignin = async () => {
    try {
      if (!allValid) return;
      const res = await fetch(`${apiUrl}/api/v1/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (res.status === 429) {
        setError("To many requests. Wait 15 minutes and try again")
        return
      }

      const data = await res.json();

      if (!res.ok) {
        console.error("errrrr");
        setError("There was an error");
      }

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("token", data.data.token)
        navigate("/dashboard");
      } else {
        setError(data.message || data.error || "There was an error");
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <div className="border border-[#ea7a53] rounded-xl w-[95%] p-5">
        <h1 className="text-2xl font-bold text-center">Log In</h1>
        <ThemedInput
          value={email}
          onChange={setEmail}
          type="email"
          title={"Email"}
          placeholder={"Enter you email"}
        />
        <ThemedInput
          value={password}
          onChange={setPassword}
          type="password"
          title={"Password"}
          placeholder={"Enter you password"}
        />
        {error}
        <div className="w-full flex justify-center pt-5 items-center">
          <Button
            title={"Sign In"}
            onPress={handleSignin}
            disabled={!allValid}
          />
        </div>
      </div>
    </div>
  );
}

export default LogIn;
