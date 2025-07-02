import React from "react";
import styles from "../styles/Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`${styles.buttonGeneric} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
