// components/ui/button.tsx
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, className = "", ...props }: ButtonProps) => {
  return (
    <button
      className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
