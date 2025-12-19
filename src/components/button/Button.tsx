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

// Button variant types
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
}

/**
 * Reusable Button Component with variants
 * 
 * @example
 * ```tsx
 * <Button variant="primary">Gradient Button</Button>
 * <Button variant="primary" flat>Flat Button</Button>
 * <Button variant="danger" flat size="lg">Large Flat Danger</Button>
 * ```
 */
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
  ...props 
}) => {
  
  // Gradient variant styles
  const gradientVariants: Record<ButtonVariant, string> = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:to-pink-700 text-white font-semibold sm:font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50',

    primary2: 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-semibold sm:font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50',

    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 text-white font-semibold sm:font-bold shadow-lg shadow-secondary-500/30',

    outline: 'bg-gray-800/80 backdrop-blur-sm border-2 border-purple-500/40 hover:border-purple-500/70 hover:bg-gray-800 text-white font-semibold sm:font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    
    ghost: 'bg-transparent hover:bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 font-semibold',
    
    danger: 'bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold sm:font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50',
    
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold sm:font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/50',
    
    link: 'bg-transparent hover:bg-transparent text-purple-400 hover:text-pink-400 underline-offset-4 hover:underline font-medium'
  };

  // Flat variant styles (no gradients)
  const flatVariants: Record<ButtonVariant, string> = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white font-semibold sm:font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50',

    primary2: 'bg-pink-600 hover:bg-pink-700 text-white font-semibold sm:font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50',

    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold sm:font-bold shadow-lg',

    outline: 'bg-gray-800/80 backdrop-blur-sm border-2 border-purple-500/40 hover:border-purple-500/70 hover:bg-gray-700 text-white font-semibold sm:font-bold',
    
    ghost: 'bg-transparent hover:bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 font-semibold',
    
    danger: 'bg-red-600 hover:bg-red-700 text-white font-semibold sm:font-bold shadow-lg shadow-red-500/30 hover:shadow-red-500/50',
    
    success: 'bg-green-600 hover:bg-green-700 text-white font-semibold sm:font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/50',
    
    link: 'bg-transparent hover:bg-transparent text-purple-400 hover:text-pink-400 underline-offset-4 hover:underline font-medium'
  };

  // Choose variant based on flat prop
  const variants = flat ? flatVariants : gradientVariants;

  // Size styles
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm md:text-base',
    lg: 'px-8 py-4 text-sm md:text-base lg:text-lg',
    xl: 'px-12 py-5 text-xl'
  };

  // Base styles
  const baseStyles = 'rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';
  
  // Hover effects
  const hoverEffect = variant !== 'link' ? 'hover:scale-105 active:scale-95' : '';
  
  // Width
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${hoverEffect}
        ${widthClass}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoaderIcon className="w-4 h-4 animate-spin" />}
      {!loading && icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;