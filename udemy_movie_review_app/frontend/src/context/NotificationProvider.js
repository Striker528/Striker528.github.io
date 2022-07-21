import React, { createContext, useState } from "react";

export const NotificationContext = createContext();

//if the user repeatably submits with an error, don't reload the notification
let timeoutId;
export default function NotificationProvider({ children }) {
  //console.log("In function")
  const [notification, setNotification] = useState("");
  const [classes, setClasses] = useState("");

  //update any type of notification
  //value: value we want to render in the paragraph at the bottom of this file
  const updateNotification = (type, value) => {
    //if the timeoutId already exists (user just hit submit with an error)
    //then the setTimeout function will not run
    if (timeoutId) clearTimeout(timeoutId);

    //using the inputted type
    //set the classes State which will be used in rendering in the return statement below
    //either red, green or orange
    switch (type) {
      case "error":
        setClasses("bg-red-500");
        break;
      case "success":
        setClasses("bg-green-500");
        break;
      case "warning":
        setClasses("bg-orange-500");
        break;
      default:
        setClasses("bg-red-500");
    }
    setNotification(value);

    timeoutId = setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  //if there is a notification, then render:: {notification && ()}
  return (
    <NotificationContext.Provider value={{ updateNotification }}>
      {children}
      {notification && (
        <div className="fixed left-1/2 -translate-x-1/2 top-24 ">
          <div className="bounce-custom shadow-md shadow-gray-400 rounded">
            <p className={classes + " text-white px-4 py-2 font-semibold"}>
              {notification}
            </p>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
