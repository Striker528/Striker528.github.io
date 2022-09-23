import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

//need to take the input "value", which is the specific tags that are inputted
export default function TagsInput({ name, value, onChange }) {
  //if we get the input "value", need to update these tags
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);

  //manipulate the dom with this
  //to not have what the user type be hidden 
  const input = useRef();
  const tagsInput = useRef();

  const handleOnChange = ({ target }) => {
    const { value } = target;
    if (value !== ",") setTag(value);

    //this handleOnChange will fire whenever the user changes something in the tag input field
    //once we set the tag, now call the normal handleOnChange function that we give to TagsInput
    //and this function that we pass (onChange) will then fill in the movieForm with the tags
    onChange(tags);
  };

  const handleKeyDown = ({ key }) => {
    if (key === "," || key === "Enter") {
      if (!tag) return;

      if (tags.includes(tag)) return setTag("");

      setTags([...tags, tag]);
      setTag("");
    }

    if (key === "Backspace" && !tag && tags.length) {
      const newTags = tags.filter((_, index) => index !== tags.length - 1);
      setTags([...newTags]);
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags([...newTags]);
  };

  //when focusing on the tags box, highlight it
  const handleOnFocus = () => {
    tagsInput.current.classList.remove(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.add("dark:border-white", "border-primary");
  };

  //click off of the tags box, remove the highlighting that was done
  const handleOnBlur = () => {
    tagsInput.current.classList.add(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.remove("dark:border-white", "border-primary");
  };

  //"value" is the dependency
  useEffect(() => {
    if (value.length) setTags(value);
  }, [value]);

  //whenever the tag changes
  //scroll into the view
  //will also push the entire screen down to focus on the tags input field
  //change from
  //input.current.scrollIntoView(); to 
  //input.current?.scrollIntoView(false);
  //now it will scroll into view only when we open the tag option
  useEffect(() => {
    input.current?.scrollIntoView(false);
  }, [tag]);

  return (
    <div>
      <div
        ref={tagsInput}
        onKeyDown={handleKeyDown}
        className="border-2 
          bg-transparent 
          dark:border-dark-subtle 
          border-light-subtle 
          px-2 
          h-10 
          rounded 
          w-full 
          text-white 
          flex 
          items-center 
          space-x-2 
          overflow-x-auto 
          custom-scroll-bar 
          transition"
      >
        {tags.map((t) => (
          <Tag onClick={() => removeTag(t)} key={t}>
            {t}
          </Tag>
        ))}
        <input
          ref={input}
          type="text"
          id={name}
          className="h-full 
            flex-grow 
            bg-transparent 
            outline-none 
            dark:text-white 
            text-primary"
          placeholder="Tag one, Tag two"
          value={tag}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
      </div>
    </div>
  );
}

const Tag = ({ children, onClick }) => {
  return (
    <span className="
      dark:bg-white
      bg-primary
      dark:text-primary
      text-white
      flex
      items-center
      text-sm
      px-1
      whitespace-nowrap">
      {children}
      <button onClick={onClick} type = "button">
        <AiOutlineClose size={12} />
      </button>
    </span>
  );
};
