import React from "react";
import { FaYoutube, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full p-3 rounded-xl border-[#ea7a53] shadow-lg bg-white">
      <div className="">
        <p className="py-1 hover:underline">
          Building Evolvo – documenting the journey in public.
        </p>
        <p className="py-1 hover:underline">© 2026 Artur Dierking</p>
        <p className="py-1 hover:underline">Early access coming soon.</p>
        <a className="py-1 underline" href="/support">Report a Problem.</a>
      </div>
      <div className="w-full flex gap-5 pt-3 border-t mt-3">
        <a href="https://youtube.com" target="_blank">
          <FaYoutube size={24} />
        </a>

        <a href="https://instagram.com" target="_blank">
          <FaInstagram size={24} />
        </a>
        <h2>Artur Dierking</h2>
      </div>
    </footer>
  );
}

export default Footer;
