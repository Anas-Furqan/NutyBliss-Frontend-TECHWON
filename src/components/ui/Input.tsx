import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = '', ...props }: InputProps) {
  return <input {...props} className={`focus-gradient rounded-xl2 w-full ${className}`.trim()} />;
}
