//hide this button if there are no inputted people
const ViewAllBtn = ({ visible, children, onClick }) => {
    if (!visible) return null;
    //when using multiple buttons in a single form, need to specify it's type
    return (
      <button
        onClick={onClick}
        type="button"
        className="dark:text-white text-primary hover:underline transition"
      >
        {children}
      </button>
    );
  };
  
export default ViewAllBtn;