import React from 'react';

// Loader icon component
const LoaderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

type ButtonVariant = 'primary' | 'primary2' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  flat?: boolean; // Kept for API compatibility, but heavily relies on new design now
  icon?: React.ReactNode;
  children: React.ReactNode;
  skewed?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  fullWidth = false,
  flat = false,
  icon = null,
  skewed = false,
  ...props
}) => {
  // Map variants to your global index.css abstractions where applicable
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'btn-p',
    primary2: 'btn-p', // Redirect to main primary for new design consistency
    secondary: 'btn-s text-white',
    outline: 'btn-s', // Outline is essentially the secondary design now
    ghost: 'bg-transparent text-maxx-mid hover:text-maxx-white hover:bg-maxx-violet/10 font-sans font-semibold tracking-wider uppercase border border-transparent transition-all',
    danger: 'btn-p !bg-red-600 !clip-none hover:!bg-red-700', // Override grad
    success: 'btn-p !bg-green-600 !clip-none hover:!bg-green-700',
    link: 'bg-transparent text-maxx-pink hover:text-maxx-white underline-offset-4 hover:underline font-sans font-bold tracking-wider uppercase'
  };

  // Only apply size overrides to non-global classes (btn-p and btn-s handle their own padding)
  const isGlobalClass = variant === 'primary' || variant === 'primary2' || variant === 'secondary' || variant === 'outline';
  
  const sizes: Record<ButtonSize, string> = {
    sm: isGlobalClass ? '' : 'px-4 py-2 text-[0.82rem]',
    md: isGlobalClass ? '' : 'px-6 py-3 text-[0.88rem]',
    lg: isGlobalClass ? '' : 'px-8 py-4 text-[0.95rem]',
    xl: isGlobalClass ? '' : 'px-12 py-5 text-[1.1rem]'
  };

  const baseStyles = 'inline-flex items-center rounded-lg justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:opacity-50';
  const widthClass = fullWidth ? 'w-full' : '';
  
  const skewedStyle = skewed ? "btn-skewed" : ""

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizes[size]}
        ${widthClass}
        ${skewedStyle}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoaderIcon className="w-4 h-4 animate-spin shrink-0" />}
      {!loading && icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
