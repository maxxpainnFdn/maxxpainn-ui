import React from 'react';

const LoaderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

type ButtonVariant = 'primary' | 'primary2' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  flat?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  skewed?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = '',
  disabled = false,
  className = '',
  fullWidth = false,
  flat = false,
  icon = null,
  skewed = false,
  ...props
}) => {
  const variantStyles: Record<ButtonVariant, string> = {
    primary: [
      'relative overflow-hidden',
      'bg-gradient-to-br from-[#ff2d78] via-[#c026d3] to-[#7c3aed]',
      'text-white border-none',
      'shadow-[0_2px_12px_rgba(192,38,211,0.35)]',
      'hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(192,38,211,0.5)]',
      'active:translate-y-0 active:shadow-[0_2px_8px_rgba(192,38,211,0.3)]',
      'after:absolute after:inset-0 after:content-[""]',
      'after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]',
      'after:-skew-x-12 after:-translate-x-full hover:after:translate-x-[250%]',
      'after:transition-transform after:duration-500 after:ease-in-out',
      'w-full sm:w-auto',
    ].join(' '),

    primary2: [
      'relative overflow-hidden',
      'bg-gradient-to-br from-[#ff2d78] via-[#c026d3] to-[#7c3aed]',
      'text-white border-none',
      'shadow-[0_2px_12px_rgba(192,38,211,0.35)]',
      'hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(192,38,211,0.5)]',
      'active:translate-y-0',
      'after:absolute after:inset-0 after:content-[""]',
      'after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]',
      'after:-skew-x-12 after:-translate-x-full hover:after:translate-x-[250%]',
      'after:transition-transform after:duration-500',
      'w-full sm:w-auto',
    ].join(' '),

    secondary: [
      'relative',
      'bg-violet-500/[0.08] backdrop-blur-md',
      'text-violet-400 border border-violet-500/30',
      'hover:text-white hover:bg-violet-500/[0.18] hover:border-violet-500/70',
      'hover:-translate-y-px hover:shadow-[0_0_20px_rgba(124,58,237,0.35)]',
      'active:translate-y-0',
      '[box-shadow:inset_0_1px_1px_rgba(255,255,255,0.05)]',
      'w-full sm:w-auto',
    ].join(' '),

    outline: [
      'bg-violet-500/[0.08] backdrop-blur-md',
      'text-violet-400 border border-violet-500/30',
      'hover:text-white hover:bg-violet-500/[0.18] hover:border-violet-500/70',
      'hover:-translate-y-px hover:shadow-[0_0_20px_rgba(124,58,237,0.35)]',
      'active:translate-y-0',
      '[box-shadow:inset_0_1px_1px_rgba(255,255,255,0.05)]',
      'w-full sm:w-auto',
    ].join(' '),

    ghost: [
      'bg-transparent text-slate-400 border border-transparent',
      'hover:text-white hover:bg-white/[0.06] hover:border-white/10',
      'active:bg-white/[0.03]',
    ].join(' '),

    danger: [
      'relative overflow-hidden',
      'bg-gradient-to-br from-rose-500 to-red-600',
      'text-white border-none',
      'shadow-[0_2px_10px_rgba(244,63,94,0.3)]',
      'hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(244,63,94,0.5)]',
      'active:translate-y-0',
      'w-full sm:w-auto',
    ].join(' '),

    success: [
      'bg-gradient-to-br from-emerald-500 to-emerald-600',
      'text-white border-none',
      'shadow-[0_2px_10px_rgba(16,185,129,0.25)]',
      'hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(16,185,129,0.4)]',
      'active:translate-y-0',
      'w-full sm:w-auto',
    ].join(' '),

    link: [
      'bg-transparent text-[#ff2d78] border-none px-1',
      'relative after:absolute after:bottom-2 after:left-0 after:right-0 after:h-px',
      'after:bg-[#ff2d78] after:scale-x-0 after:origin-left',
      'hover:after:scale-x-100 hover:text-white',
      'after:transition-transform after:duration-200',
    ].join(' '),
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs rounded-lg',
    md: 'px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-[11px] sm:text-xs md:text-sm rounded-[10px]',
    lg: 'px-5 py-2.5 sm:px-7 sm:py-3 md:px-8 md:py-3.5 text-xs sm:text-sm lg:text-base rounded-xl',
    xl: 'px-6 py-3 sm:px-9 sm:py-4 md:px-12 md:py-5 text-xs sm:text-sm lg:text-base xl:text-lg rounded-[14px]',
  };

  const base = [
    'inline-flex items-center justify-center gap-2',
    'font-bold tracking-wider uppercase whitespace-nowrap',
    'transition-all duration-200',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none',
  ].join(' ');

  const resolvedLoadingText = loadingText.trim() === '' ? children : loadingText;

  return (
    <button
      className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? '!w-full' : ''} ${skewed ? '-skew-x-12' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {skewed ? (
        <span className="inline-flex items-center gap-2 skew-x-12">
          {loading ? (
            <>{resolvedLoadingText} <LoaderIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin shrink-0" /></>
          ) : (
            <>{icon && <span className="shrink-0">{icon}</span>}{children}</>
          )}
        </span>
      ) : loading ? (
        <>{resolvedLoadingText} <LoaderIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin shrink-0" /></>
      ) : (
        <>{icon && <span className="shrink-0">{icon}</span>}{children}</>
      )}
    </button>
  );
};

export default Button;
