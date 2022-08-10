import React, { forwardRef, useEffect, useRef, useState } from "react";
import { commonInputClasses } from "../utils/theme";

export default function LiveSearch({
  value = "",
  placeholder = "",
  results = [],
  name,
  selectedResultStyle,
  resultContainerStyle,
  inputStyle,
  renderItem = null,
  onChange = null,
  onSelect = null,
}) {
  //creating state displaySearch
  //turning these off(false) or on(true) will show the displaySearch or not:
  const [displaySearch, setDisplaySearch] = useState(false);

  //State of focusedIndex: setting where on the output for list of people the user is looking at:
  //using -1, as if we used 0, the very first option on the drop down list will be selected
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleOnFocus = () => {
    //so when we click on the box for people, and there are people in the database (passed in the function LiveSearch)
    //then we will show the options to click on
    if (results.length) setDisplaySearch(true);
  };

  const closeSearch = () => {
    //closing the box
    setDisplaySearch(false);
    //resetting who was selected when we click out
    setFocusedIndex(-1);
  };

  const handleOnBlur = () => {
    //when clicking out of the box, need to close the search box of all the different people and reset the index
    setTimeout(() => {
      closeSearch();
    }, 100);
  };

  const handleSelection = (selectedItem) => {
    if (selectedItem) {
      onSelect(selectedItem);
      //once we select something, close the drop down and reset the index
      closeSearch();
    }
  };

  //to handle the user using the arrow keys to select a person
  const handleKeyDown = ({ key }) => {
    let nextCount;
    const keys = ["ArrowDown", "ArrowUp", "Enter", "Escape"];
    //if the user is pressing a key other than these 4, do nothing
    if (!keys.includes(key)) return;

    // move selection up and down
    if (key === "ArrowDown") {
      //normal: nextCount = focusedIndex + 1
      //if you go to the very top of the director options, it would go into the text box
      //if want an infinite loop, when we go to the top of hte form, hit up, go to the very bottom of the character form
      //for an infinite loop, need %
      nextCount = (focusedIndex + 1) % results.length;
    }
    if (key === "ArrowUp") {
      nextCount = (focusedIndex + results.length - 1) % results.length;
    }

    if (key === "Escape") return closeSearch();

    if (key === "Enter") return handleSelection(results[focusedIndex]);

    setFocusedIndex(nextCount);
  };

  const getInputStyle = () => {
    return inputStyle
      ? inputStyle
      : commonInputClasses + " border-2 rounded p-1 text-lg";
  };

  return (
    <div className="relative">
      <input
        type="text"
        id={name}
        name={name}
        className={getInputStyle()}
        placeholder={placeholder}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onKeyDown={handleKeyDown}
        value={value}
        onChange={onChange}
      />
      <SearchResults
        focusedIndex={focusedIndex}
        visible={displaySearch}
        results={results}
        onSelect={handleSelection}
        renderItem={renderItem}
        resultContainerStyle={resultContainerStyle}
        selectedResultStyle={selectedResultStyle}
      />
    </div>
  );
}

const SearchResults = ({
  visible,
  results = [],
  focusedIndex,
  onSelect,
  renderItem,
  resultContainerStyle,
  selectedResultStyle,
}) => {
  const resultContainer = useRef();

  useEffect(() => {
    //so that the person highlighted in the drop down field will be auto scrolled to
    //and that when possible the person highlighted will be the center of the form
    resultContainer.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [focusedIndex]);

  if (!visible) return null;

  //with className = "absolute", can put it anywhere in the "realative" div
  //rendering the results below
  return (
    <div className="
      absolute
      z-50
      right-0
      left-0
      top-10
      bg-white
      dark:bg-secondary
      shadow-md
      p-2
      max-h-64
      space-y-2
      mt-1
      overflow-auto
      custom-scroll-bar">
      {results.map((result, index) => {
        const getSelectedClass = () => {
          return selectedResultStyle
            ? selectedResultStyle
            : "dark:bg-dark-subtle bg-light-subtle";
        };

        return (
          <ResultCard
            ref={index === focusedIndex ? resultContainer : null}
            key={index.toString()}
            item={result}
            renderItem={renderItem}
            resultContainerStyle={resultContainerStyle}
            selectedResultStyle={
              index === focusedIndex ? getSelectedClass() : ""
            }
            onMouseDown={() => onSelect(result)}
          />
        );
      })}
    </div>
  );
};

//need to have the reference of the div, and react provides 'forwardRef'
//cannot just call ref in the const{} = props;
const ResultCard = forwardRef((props, ref) => {
  const {
    item,
    renderItem,
    resultContainerStyle,
    selectedResultStyle,
    onMouseDown,
  } = props;

  const getClasses = () => {
    if (resultContainerStyle)
      //allowing the user to change the style of the container
      return resultContainerStyle + " " + selectedResultStyle;

    return (
      selectedResultStyle +
      " cursor-pointer rounded overflow-hidden dark:hover:bg-dark-subtle hover:bg-light-subtle transition"
    );
  };
  return (
    <div onMouseDown={onMouseDown} ref={ref} className={getClasses()}>
      {renderItem(item)}
    </div>
  );
});
