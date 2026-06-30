import React, { useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

function Support() {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  const isValid = text.trim().length >= 15;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) return;

    try {
      const res = await fetch(`${apiUrl}/api/v1/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: text,
          user: JSON.parse(localStorage.getItem("user"))._id,
        }),
      });

      if (res.status === 429) {
        setError("To many requests. Wait 15 minutes and try again");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError("there was an unknown error.");
      }

      if (data.success) {
        setError(
          "The ticket has been submitted successfully!\n We’ll work on that in any moment.",
        );
      } else {
        setError(data.error || data.message || "There was an error");
      }

      setText("");
    } catch (error) {
      setError(error.message || "There was an Error while Submit");
    }
  };

  return (
    <div className="w-full p-5">
      <h1 className="font-bold text-center text-2xl text-[#ea7a53]">
        Support Ticket
      </h1>
      <p className="text-center">Create a ticket and describe your problem</p>
      <div className="pt-10 w-full">
        <form onSubmit={handleSubmit} className="max-w-md w-full space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe your problem"
            rows={5}
            className="
          w-full
          p-3
          border
          rounded-lg
          resize-none
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
          />

          {!isValid && text.length > 0 && (
            <p className="text-sm text-red-500">
              Please describe your problem in a bit more detail
            </p>
          )}
          {error}
          <div className="w-full flex justify-center pt-5 items-center">
            <button
              type="submit"
              disabled={!isValid}
              className={`
                px-4 py-2 rounded-lg text-white transition
                ${isValid ? "bg-[#ea7a53]" : "bg-[#ea7a53]/50 cursor-not-allowed"}
                `}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Support;
