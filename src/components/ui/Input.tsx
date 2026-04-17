import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
  return <input ref={ref} {...props} className={`focus-gradient rounded-xl2 w-full ${className}`.trim()} />;
});

Input.displayName = 'Input';

export default Input;
