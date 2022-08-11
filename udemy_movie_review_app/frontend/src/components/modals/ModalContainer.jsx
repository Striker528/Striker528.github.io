import React from "react";

export default function ModalContainer({
  //if we click on view all or want to see the container, then visible will be true
  visible,
  ignoreContainer,
  children,
  //onClose is for when the user wants to close the model
  onClose,
}) {
  const handleClick = (e) => {
    if (e.target.id === "modal-container") onClose();
  };

  const renderChildren = () => {
    if (ignoreContainer) return children;

    return (
      <div className="
        dark:bg-primary
        bg-white
        rounded
        w-[45rem]
        h-[40rem]
        overflow-auto
        p-2
        custom-scroll-bar"
      >
        {children}
      </div>
    );
  };

  //if the container is not supposed to be visible, don't show it
  if (!visible) return null;

  //when renderingChildren, may want to avoid the div
  //so need to make it a function that gives us that option
  return (
    <div
      onClick={handleClick}
      id="modal-container"
      className="fixed inset-0 dark:bg-white dark:bg-opacity-50 bg-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
    >
      {renderChildren()}
    </div>
  );
}
