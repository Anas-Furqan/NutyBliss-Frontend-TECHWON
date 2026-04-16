import Link from 'next/link';
import type { ReactNode } from 'react';

type ButtonProps = {
  href?: string;
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({
  href,
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  onClick,
  disabled,
}: ButtonProps) {
  const classes = `${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${classes} disabled:cursor-not-allowed disabled:opacity-60`}>
      {children}
    </button>
  );
}
