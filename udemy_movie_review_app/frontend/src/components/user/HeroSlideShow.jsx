import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { forwardRef } from "react";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getLatestUploads } from "../../api/movie";
import { useNotification } from "../../hooks";

let count = 0;
let intervalId = 0;

export default function HeroSlideShow() {
  const [currentSlide, setCurrentSlide] = useState({});
  const [clonedSlide, setClonedSlide] = useState({});
  const [slides, setSlides] = useState([]);
  const [upNext, setUpNext] = useState([]);
  const [visible, setVisible] = useState(true);
  //const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef();
  const clonedSlideRef = useRef();

  const { updateNotification } = useNotification();

  const fetchLatestUploads = async (signal) => {
    const { error, movies } = await getLatestUploads(signal);
    if (error) return updateNotification("error", error);
    setSlides([...movies]);
    setCurrentSlide(movies[0]);
  };

  //need to reset the interval for the slideshow after the user leaves the page so that there won't be any errors
  const pauseSlideShow = () => {
    clearInterval(intervalId);
  };

  const updateUpNext = (currentIndex) => {
    if (!slides.length) return;

    const upNextCount = currentIndex + 1;
    const end = upNextCount + 3;

    let newSlides = [...slides];

    newSlides = newSlides.slice(upNextCount, end);

    if (!newSlides.length) {
      newSlides = [...slides].slice(0, 3);
    }

    setUpNext([...newSlides]);
  };

  const startSlideShow = () => {
    //call the function handleOnNextClick after 3500 milliseconds (3.5 seconds)
    //setInterval will give back an id
    intervalId = setInterval(handleOnNextClick, 3500);
  };

  //We get back the 5 latest movies, an in the array ordered: 0, 1, 2, 3, 4
  const handleOnNextClick = () => {
    //slideshow not pausing when hitting next
    pauseSlideShow();

    //in order to have the current slide transition to the left like the next slide, have to clone it
    setClonedSlide(slides[count]);

    //want to go to the next movies
    //have all the movies in the slides State

    //this will always return a value between 0 and the array's length
    count = (count + 1) % slides.length;
    setCurrentSlide(slides[count]);
    //setCurrentIndex(count);

    //adding in the animation to slide in from right from index.css file at the top of frontend (in src)
    //this has to be removed before the user clicks on the right button again or it won't play
    //it won't play as the image will already have the class and it only activates once we add the class to the image
    //removing in handleAnimationEnd
    clonedSlideRef.current.classList.add("slide-out-to-left");
    slideRef.current.classList.add("slide-in-from-right");

    updateUpNext(count);
  };

  const handleOnPrevClick = () => {
    //slideshow not pausing when hitting next
    pauseSlideShow();

    setClonedSlide(slides[count]);
    count = (count + slides.length - 1) % slides.length;
    setCurrentSlide(slides[count]);
    //setCurrentIndex(count);

    //code to activate the animations
    clonedSlideRef.current.classList.add("slide-out-to-right");
    slideRef.current.classList.add("slide-in-from-left");

    updateUpNext(count);
  };

  const handleAnimationEnd = () => {
    const classes = [
      "slide-in-from-right",
      "slide-out-to-left",
      "slide-out-to-right",
      "slide-in-from-left",
    ];
    //spreading the classes: ...(array)
    slideRef.current.classList.remove(...classes);
    clonedSlideRef.current.classList.remove(...classes);

    //now have to clear the cloned slide so that the next poster will be cloned
    setClonedSlide({});

    //now at the end, continue the slideshow that was paused at handleOnPrev and Next Click
    startSlideShow();
  };

  const handleOnVisibilityChange = () => {
    //console.log(document.visibilityState);
    const visibility = document.visibilityState;
    if (visibility === "hidden") setVisible(false);
    if (visibility === "visible") setVisible(true);
  };

  //functions to call as soon as we load and leave the application
  useEffect(() => {
    const ac = new AbortController();
    fetchLatestUploads(ac.signal);
    document.addEventListener("visibilitychange", handleOnVisibilityChange);

    //return the clean up function to reset the interval here
    return () => {
      //console.log("I am out");
      pauseSlideShow();
      document.removeEventListener(
        "visibilitychange",
        handleOnVisibilityChange
      );

      ac.abort();
    };
  }, []);

  //inside put the dependency slides.length so if there is some length, then call the function
  useEffect(() => {
    if (slides.length && visible) {
      startSlideShow();
      updateUpNext(count);
    } else pauseSlideShow();
  }, [slides.length, visible]);

  return (
    <div className="w-full flex">
      {/*Slide Show section */}
      {/*If using absolute below a div, have to make the top div relative */}
      <div className="w-4/5 aspect-video relative overflow-hidden">
        {/*Current Slide */}
        <Slide
          ref={slideRef}
          title={currentSlide.title}
          src={currentSlide.poster}
          id={currentSlide.id}
        />

        {/*The cloned image that will transition to the left out of view*/}
        <Slide
          ref={clonedSlideRef}
          onAnimationEnd={handleAnimationEnd}
          className="absolute inset-0"
          src={clonedSlide.poster}
          title={clonedSlide.title}
          id={currentSlide.id}
        />
        <SlideShowController
          onPrevClick={handleOnPrevClick}
          onNextClick={handleOnNextClick}
        />
      </div>

      {/*Up next section */}
      <div className="w-1/5 space-y-3 px-3">
        <h1 className="font-semibold text-2xl text-primary dark:text-white">
          Up Next
        </h1>
        {upNext.map(({ poster, id }) => {
          return (
            <img
              key={id}
              src={poster}
              alt=""
              className="aspect-video object-cover rounded"
            />
          );
        })}
      </div>
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

//in order to use the reference in this separate function, need to wrap everything in forwardRef from React
const Slide = forwardRef((props, ref) => {
  /*Issue where the next movie poster would change slides, these classNames below fixes that */
  /*We want to slide the next image to the left and the previous one to the right, so we are going to put
  the next poster 80% over to the right (translate-x-[80%]) and cover some of it (overflow-hidden above) */
  /*To remove an animation once it has ended: onAnimationEnd={() => console.log("Hello")}*/

  const { title, id, src, className = "", ...rest } = props;

  return (
    <Link
      to={"/movie/" + id}
      ref={ref}
      className={"w-full cursor-pointer block " + className}
      {...rest}
    >
      {src ? (
        <img className="aspect-video object-cover" src={src} alt="" />
      ) : null}
      {title ? (
        <div className="absolute inset-0 flex flex-col justify-end py-3 bg-gradient-to-t from-white via-transparent dark:from-primary dark:via-transparent">
          <h1 className="font-semibold text-4xl dark:text-highlight-dark text-highlight">
            {title}
          </h1>
        </div>
      ) : null}
    </Link>
  );
});
