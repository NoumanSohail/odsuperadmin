import { ReactNode } from "react";

interface ButtonProps {
  title: string;
  onClick: () => void;
  type?: "button" | "submit";
  disabled?: boolean;

  /* 🔹 Optional Icon */
  icon?: ReactNode;
  iconPosition?: "left" | "right";

  /* 🔹 External Styles */
  className?: string;
}

const Button = ({
  title,
  onClick,
  type = "button",
  disabled = false,
  icon,
  iconPosition = "left",
  className = "",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`
        group
        w-full p-2 rounded-xl font-bold shadow-lg
        transition-all transform
        flex items-center justify-center gap-2

        ${
          disabled
            ? "bg-(--color-gray) text-(--color-sidebar) cursor-not-allowed opacity-70"
            : "bg-(--color-primary) text-(--color-sidebar) hover:bg-(--color-secondary) hover:scale-102 hover:text-black cursor-pointer"
        }

        ${className}
      `}
    >
      {/* ICON LEFT */}
      {icon && iconPosition === "left" && (
        <span className="button-icon flex items-center">
          {icon}
        </span>
      )}

      <span>{title}</span>

      {/* ICON RIGHT */}
      {icon && iconPosition === "right" && (
        <span className="button-icon flex items-center">
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;
