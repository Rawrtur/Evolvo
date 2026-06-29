import { useState } from "react";
import "./Carousel.css";

function Carousel({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = Array.isArray(children) ? children : [children];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const previousSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="carousel">
      <button
        className="bg-gray-300/50 h-50 px-1 rounded-full"
        onClick={previousSlide}
      >
        &#10094;
      </button>

      <div className="carousel-window">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div className="carousel-slide" key={index}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      <button
        className="bg-gray-300/50 h-50 px-1 rounded-full"
        onClick={nextSlide}
      >
        &#10095;
      </button>
    </div>
  );
}

export default Carousel;
