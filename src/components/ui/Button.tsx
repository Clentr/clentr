import type { ReactNode } from "react";
import { ArrowRight } from "./Icons";
import { Magnetic } from "./Magnetic";

type Props = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost" | "default";
  size?: "sm" | "md";
  icon?: ReactNode | false;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

export function Button({ children, href, variant = "default", size = "md", icon, type = "button", disabled, className }: Props) {
  const cls = ["btn", variant !== "default" && `btn--${variant}`, size === "sm" && "btn--sm", className]
    .filter(Boolean)
    .join(" ");
  const inner = (
    <>
      <span>{children}</span>
      {icon !== false && <span className="btn__icon">{icon ?? <ArrowRight />}</span>}
    </>
  );
  return (
    <Magnetic>
      {href ? (
        <a href={href} className={cls}>
          {inner}
        </a>
      ) : (
        <button type={type} className={cls} disabled={disabled}>
          {inner}
        </button>
      )}
    </Magnetic>
  );
}
