import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Progress({ page, totalPages }) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex relative justify-center items-center gap-3 px-10 py-5">
      {page !== 1 && <button onClick={() => navigate(`/onboard/${page - 1}`)}>
        <ChevronLeft size={40} className="absolute top-2 left-0" />
      </button>}
      {Array.from({ length: page }, (_, index) => (
        <div
          key={index}
          className="w-[25%] h-3 rounded-full bg-[#ea7a53]"
        ></div>
      ))}
      {Array.from({ length: totalPages - page }, (_, index) => (
        <div
          key={index}
          className="w-[25%] h-3 rounded-full bg-[#d9d9d9]"
        ></div>
      ))}
    </div>
  );
}

export default Progress;
