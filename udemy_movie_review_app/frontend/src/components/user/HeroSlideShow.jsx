import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { getLatestUploads } from "../../api/movie";
import { useNotification } from "../../hooks";

let count = 0;

export default function HeroSlideShow() {
  const [slide, setSlide] = useState({});
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { updateNotification } = useNotification();

  const fetchLatestUploads = async () => {
    const { error, movies } = await getLatestUploads();
    if (error) return updateNotification("error", error);
    setSlides([...movies]);
    setSlide(movies[0]);
  };

  //We get back the 5 latest movies, an in the array ordered: 0, 1, 2, 3, 4
  const handleOnNextClick = () => {
    //want to go to the next movies
    //have all the movies in the slides State

    //this will always return a value between 0 and the array's length
    count = (count + 1) % slides.length;
    setSlide(slides[count]);
    setCurrentIndex(count);
  };

  const handleOnPrevClick = () => {
    count = Math.abs(count - 1) % slides.length;
    setSlide(slides[count]);
    setCurrentIndex(count);
  };

  useEffect(() => {
    fetchLatestUploads();
  }, []);

  return (
    <div className="w-full flex">
      {/*Slide Show section */}
      {/*If using absolute below a div, have to make the top div relative */}
      <div className="w-4/5 aspect-video relative">
        {/*Issue where the next movie poster would change slides, these classNames below fixes that */}
        <img className="aspect-video object-cover" src={slide.poster} alt="" />
        <SlideShowController
          onPrevClick={handleOnPrevClick}
          onNextClick={handleOnNextClick}
        />
      </div>

      {/*Up next section */}
      <div className="w-1/5 aspect-video bg-red-300"></div>
    </div>
  );
}

const SlideShowController = ({ onPrevClick, onNextClick }) => {
  const btnClass =
    "bg-primary rounded border-2 text-white text-xl p-2 outline-none";
  return (
    <div className="absolute top-1/2 -translate-y-1/2 w-full flex items-center justify-between px-2">
      {/*top-1/2: make the div container half of the height
        -translate-y-1/2: Remove 50% of the height from the y axis */}
      <button onClick={onPrevClick} className={btnClass} type="button">
        <AiOutlineDoubleLeft />
      </button>
      <button onClick={onNextClick} className={btnClass} type="button">
        <AiOutlineDoubleRight />
      </button>
    </div>
  );
};
