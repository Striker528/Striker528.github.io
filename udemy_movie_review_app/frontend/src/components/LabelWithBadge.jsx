import Label from "./Label";

//creating the notification of how many writers that were selected
const LabelWithBadge = ({ children, htmlFor, badge = 0 }) => {
    const renderBadge = () => {
      //if there are no people submitted, don't show 0, show nothing
      if (!badge) return null;
      return (
        <span className="
          dark:bg-dark-subtle
          bg-light-subtle
          text-white
          absolute
          top-0
          right-0
          translate-x-6
          -translate-y-1
          text-xs
          w-5
          h-5
          rounded-full
          flex
          justify-center
          items-center"
        >
          {badge <= 9 ? badge : "9+"}
        </span>
      );
    };
  
    return (
      <div className="relative">
        <Label htmlFor={htmlFor}>{children}</Label>
        {renderBadge()}
      </div>
    );
};
  
export default LabelWithBadge;