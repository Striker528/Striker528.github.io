import React from "react";

export default function GridContainer({ children, className }) {
  //Using an array to made 5 empty red boxes:
  // {Array(5)
  //     .fill("")
  //     .map((_, index) => {
  //     return <div className="p-5 bg-red-200" ky = {index}></div>
  // })}

  //give a breakpoint of lg
  //only give the grid-cols-5 if the screen is large enough
  // medium screen: md-grid-cols-2
  // small screen: grid-cols-1
  return (
    <div
      className={
        "grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-3 " + className
      }
    >
      {children}
    </div>
  );
}
