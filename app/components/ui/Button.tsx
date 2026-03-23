import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "accent";
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg transition cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    accent: "bg-blue-500 text-white hover:bg-blue-600",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      {...props}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
    >
      {children}
    </button>
  );
}
