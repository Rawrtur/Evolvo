import { useState } from "react";
import { Clipboard } from "lucide-react"

export default function InviteBox({ inviteLink }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(inviteLink);
      } else {
        // Fallback für ältere Browser
        const textArea = document.createElement("textarea");
        textArea.value = inviteLink;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="relative rounded-xl bg-gray-100 p-4">
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-3 rounded-lg p-2 text-gray-600 transition hover:bg-gray-200 hover:text-black active:scale-95"
        aria-label="Copy invite link"
      >
        <Clipboard className="h-5 w-5" />
      </button>

      <p className="text-sm text-gray-500">Your Invite Link:</p>

      <p className="mt-2 break-all pr-12 font-mono">
        {inviteLink}
      </p>

      {copied && (
        <div className="absolute bottom-3 right-3 rounded-lg bg-green-600 px-3 py-1 text-sm text-white shadow-lg">
          ✓ Link copied!
        </div>
      )}
    </div>
  );
}