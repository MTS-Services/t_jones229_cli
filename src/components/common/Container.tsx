import React from "react";

// 1. Add className? (optional) to the interface
interface ContainerProps {
  children: React.ReactNode;
  className?: string; // The '?' makes it optional
}

// 2. Destructure className here
const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
  return (
    <div
      // We use a template literal to merge your default styles with the new ones
      className={`container mx-auto xl:px-6 lg:px-5 md:px-4 px-3 lg:my-24 md:my-20 my-16 ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
