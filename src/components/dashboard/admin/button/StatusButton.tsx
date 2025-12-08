import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;  // Hex color (default: #42DF3A)
  fullWidth?: boolean; // Override fixed width if needed
}

const StatusButton = ({
  color = '#42DF3A',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`
        flex items-center justify-center 
        h-7 ${fullWidth ? 'w-full' : 'w-[124px]'} 
        rounded-[4px] py-1 px-2 gap-2.5 
        transition-colors disabled:opacity-50 
        ${className}
      `}
      style={{ backgroundColor: color }}
      {...props}
    >
      {children}
    </button>
  );
};

export default StatusButton;