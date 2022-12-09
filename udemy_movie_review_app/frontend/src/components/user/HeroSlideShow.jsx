import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { getLatestUploads } from "../../api/movie";
import { useNotification } from "../../hooks";

let count = 0;

export default function HeroSlideShow() {
  const [slide, setSlide] = useState({});
  const [clonedSlide, setClonedSlide] = useState({});
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef();
  const clonedSlideRef = useRef();

  const { updateNotification } = useNotification();

  const fetchLatestUploads = async () => {
    const { error, movies } = await getLatestUploads();
    if (error) return updateNotification("error", error);
    setSlides([...movies]);
    setSlide(movies[0]);
  };

  //We get back the 5 latest movies, an in the array ordered: 0, 1, 2, 3, 4
  const handleOnNextClick = () => {
    //in order to have the current slide transition to the left like the next slide, have to clone it
    setClonedSlide(slides[count]);

    //want to go to the next movies
    //have all the movies in the slides State

    //this will always return a value between 0 and the array's length
    count = (count + 1) % slides.length;
    setSlide(slides[count]);
    setCurrentIndex(count);

    //adding in the animation to slide in from right from index.css file at the top of frontend (in src)
    //this has to be removed before the user clicks on the right button again or it won't play
    //it won't play as the image will already have the class and it only activates once we add the class to the image
    //removing in handleAnimationEnd
    clonedSlideRef.current.classList.add("slide-out-to-left");
    slideRef.current.classList.add("slide-in-from-right");
  };

  const handleOnPrevClick = () => {
    count = Math.abs(count - 1) % slides.length;
    setSlide(slides[count]);
    setCurrentIndex(count);
  };

  const handleAnimationEnd = () => {
    slideRef.current.classList.remove("slide-in-from-right");
    clonedSlideRef.current.classList.remove("slide-out-to-left");
    //now have to clear the cloned slide so that the next poster will be cloned
    setClonedSlide({});
  };

  useEffect(() => {
    fetchLatestUploads();
  }, []);

  return (
    <div className="w-full flex">
      {/*Slide Show section */}
      {/*If using absolute below a div, have to make the top div relative */}
      <div className="w-4/5 aspect-video relative overflow-hidden">
        {/*Issue where the next movie poster would change slides, these classNames below fixes that */}
        {/*We want to slide the next image to the left and the previous one to the right, so we are going to put
        the next poster 80% over to the right (translate-x-[80%]) and cover some of it (overflow-hidden above) */}
        {/*To remove an animation once it has ended: onAnimationEnd={() => console.log("Hello")}*/}
        <img
          onAnimationEnd={handleAnimationEnd}
          ref={slideRef}
          className="aspect-video object-cover"
          src={slide.poster}
          alt=""
        />
        {/*The cloned image that will transition to the left out of view*/}
        <img
          onAnimationEnd={handleAnimationEnd}
          ref={clonedSlideRef}
          className="aspect-video object-cover absolute inset-0"
          src={clonedSlide.poster}
          alt=""
        />
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
