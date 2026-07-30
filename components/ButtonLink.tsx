import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const baseClasses =
  "inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white shadow-soft hover:bg-brand-700 focus-visible:outline-brand-300",
  secondary:
    "border border-white/70 bg-white/12 text-white backdrop-blur hover:bg-white/20 focus-visible:outline-white",
  ghost:
    "border border-slate-200 bg-white text-brand-700 hover:border-brand-200 hover:bg-brand-50 focus-visible:outline-brand-300",
};

export function ButtonLink({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <a className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </a>
  );
}
