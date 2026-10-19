import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonStyles } from "./styles";

type Variant = keyof typeof buttonStyles;

export function Button({ variant = "primary", className = "", type = "button", ...rest }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button type={type} className={`${buttonStyles[variant]} ${className}`} {...rest} />;
}

/** A link that looks like a button, for actions that go to another page. */
export function ButtonLink({ variant = "primary", className = "", ...rest }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${buttonStyles[variant]} ${className}`} {...rest} />;
}
