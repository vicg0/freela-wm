import { ButtonHTMLAttributes } from "react";

interface TButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  text: string;
}

export function Button({ icon, text, ...props }: TButton) {
  return (
    <button {...props}>
      {icon}
      {text}
    </button>
  )
}