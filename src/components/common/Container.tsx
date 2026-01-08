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
      className={`container mx-auto px-4 lg:my-16 md:my-12 my-8 ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
