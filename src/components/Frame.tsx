import React from 'react';

interface FrameProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
}

export const Frame: React.FC<FrameProps> = ({
  title,
  subtitle,
  children,
  className = '',
  variant = 'default',
  padding = 'md',
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-card text-card-foreground',
    bordered: 'bg-card text-card-foreground border border-border',
    elevated: 'bg-card text-card-foreground shadow-lg',
  };

  return (
    <div
      className={`rounded-lg ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-2xl font-semibold text-foreground">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

// Card variant with more specific styling
export const Card: React.FC<FrameProps> = (props) => {
  return (
    <Frame
      {...props}
      variant="bordered"
      className={`transition-all duration-200 hover:shadow-md ${props.className || ''}`}
    />
  );
};

// Section frame for grouping content
export const Section: React.FC<FrameProps> = (props) => {
  return (
    <Frame
      {...props}
      variant="default"
      className={`border-l-4 border-primary ${props.className || ''}`}
    />
  );
};

// Modal-like frame
export const Modal: React.FC<FrameProps & { isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = false,
  onClose,
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative z-10 max-w-lg w-full mx-4">
        <Frame
          {...props}
          variant="elevated"
          className={`bg-background ${props.className || ''}`}
        >
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          {props.children}
        </Frame>
      </div>
    </div>
  );
};