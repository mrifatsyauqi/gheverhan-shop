import { ElementType, HTMLAttributes } from "react";

export type TypographyVariant = "heading" | "body";

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TypographyVariant;
}

const variantClasses: Record<TypographyVariant, string> = {
  heading: "font-heading",
  body: "font-body",
};

export function Typography({
  as: Component = "p",
  variant = "body",
  className = "",
  ...props
}: TypographyProps) {
  return <Component className={`${variantClasses[variant]} ${className}`} {...props} />;
}
