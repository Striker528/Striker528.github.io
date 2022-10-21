import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsFillSunFill } from "react-icons/bs";
import { useTheme } from "../../hooks";

export default function Header({ onAddMovieClick, onAddActorClick }) {
  const [showOptions, setShowOptions] = useState(false);
  const { toggleTheme } = useTheme();

  const options = [
    { title: "Add Movie", onClick: onAddMovieClick },
    { title: "Add Actor", onClick: onAddActorClick },
  ];

  return (
    <div className="flex items-center justify-between relative">
      <input
        type="text"
        className="
          border-2 
          dark:border-dark-subtle 
          border-light-subtle 
          dark:focus:border-white 
          focus:border-primary 
          dark:text-white transition 
          bg-transparent 
          rounded 
          text-lg 
          p-1 
          outline-none"
        placeholder="Search Movies..."
      />

      <div className="flex items-center space-x-3">
        <button
          onClick={toggleTheme}
          className="dark:text-white text-light-subtle"
        >
          <BsFillSunFill size={24} />
        </button>
        <button
          onClick={() => setShowOptions(true)}
          className="
            flex items-center space-x-2 
            dark:border-dark-subtle 
            border-light-subtle 
            dark:text-dark-subtle 
            text-light-subtle 
            hover:opacity-80 
            transition 
            font-semibold 
            border-2 
            rounded 
            text-lg 
            px-3 
            py-1"
        >
          <span>Create</span>
          <AiOutlinePlus />
        </button>

        <CreateOptions
          visible={showOptions}
          onClose={() => setShowOptions(false)}
          options={options}
        />
      </div>
    </div>
  );
}

const CreateOptions = ({ options, visible, onClose }) => {
  const container = useRef();
  const containerID = "option-container";

  useEffect(() => {
    const handleClose = (e) => {
      if (!visible) return;
      const { parentElement, id } = e.target;
      if (parentElement.id === containerID || id === containerID) return;

      //need this additional if statement as without it the container would immmedietly open then close
      /*
      This is happening because inside our useEffect hook we are using visible as dependency. Like this:

      useEffect(() => {
      const handleClose = (e) => {
        if (!visible) return;
        const { parentElement, id } = e.target;
        if (parentElement.id === containerID || id === containerID) return;
    
        container.current.classList.remove("animate-scale");
        container.current.classList.add("animate-scale-reverse");
        
      };
        document.addEventListener("click", handleClose);
        return () => {
          document.removeEventListener("click", handleClose);
        };
      }, [visible]);

      see what we are doing here we are removing animate-scale from the classlist 
      and adding new one called animate-scale-reverse now this useEffect will fire once the visible prop 
      becomes true and this will happen on every time we want to show the drop down.

      But the main villain in our code is handleAnimationEnd this function is tied to the hook onAnimationEnd 
      so what we are doing inside this function is we are removing the dropdown by calling onClose 
      if the classList contains animate-scale-reverse and this condition will be true because 
      we just shuffled these classes inside our useEffect hook

      const handleAnimationEnd = (e) => {
      if (e.target.classList.contains("animate-scale-reverse")) onClose();
        e.target.classList.remove("animate-scale");
      };

      so to prevent this if we change the logic inside our useEffect

      This will fix the problem because inside here we are adding animate-scale-reverse 
      which is the class to close dropdown only if there is no animate-scale 
      and at first render this condition will be false because there will there will be animate-scale 
      but right after that the onAnimationEnd will be fire and there we will remove animate-scale 
      and in the next time the logic inside useEffect will be true and it will add that animate-scale-reverse 
      and now because of this the condition inside handleAnimationEnd will be true 
      and it will close the dropDown with onClose and same thing will be applied in the next render.


      */
      if (container.current) {
        if (!container.current.classList.contains("animate-scale"))
          container.current.classList.add("animate-scale-reverse");
      }
    };

    document.addEventListener("click", handleClose);
    return () => {
      document.removeEventListener("click", handleClose);
    };
  }, [visible]);

  const handleAnimationEnd = (e) => {
    if (e.target.classList.contains("animate-scale-reverse")) onClose();
    e.target.classList.remove("animate-scale");
  };

  const handleClick = (fn) => {
    //onClose is prompt
    fn()
    onClose()
  }

  if (!visible) return null;
  //showing the modal creation options
  //instead of using onClick, wrap inside function
  //inside function, create handleClick
  //inside handleClick, pass onClick
  //now once we click the option to create a movie, the options windows will auto close

  //key needs to be unique for the options.map
  //so need to add key={title}
  return (
    <div
      id={containerID}
      ref={container}
      className="
        absolute 
        right-0 
        top-12
        z-50
        flex 
        flex-col 
        space-y-3 p-5  
        dark:bg-secondary 
        bg-white 
        drop-shadow-lg 
        rounded 
        animate-scale"
      onAnimationEnd={handleAnimationEnd}
    >
      {options.map(({ title, onClick }) => {
        return <Option key={title} onClick={() => handleClick(onClick)}>{title}</Option>;
      })}
    </div>
  );
};

const Option = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="dark:text-white text-secondary hover:opacity-80 transition"
    >
      {children}
    </button>
  );
};
