import React, { useState } from "react";

const Rating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex justify-center">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={`text-3xl ${
              index <= (hover || rating) ? "text-yellow-500" : "text-gray-400"
            } hover:scale-[1.2] transition ease-out duration-200 h-24`}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
};

export default Rating;
