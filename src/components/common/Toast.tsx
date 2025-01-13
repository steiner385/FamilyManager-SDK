import React from 'react';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      variant = 'info',
      title,
      description,
      icon,
      action,
      onClose,
      autoClose = true,
      duration = 5000,
      position = 'bottom-right',
      className = '',
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
      if (autoClose && isVisible) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [autoClose, duration, isVisible, onClose]);

    if (!isVisible) return null;

    const variants = {
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-400',
        title: 'text-blue-800',
        description: 'text-blue-700',
      },
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-400',
        title: 'text-green-800',
        description: 'text-green-700',
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: 'text-yellow-400',
        title: 'text-yellow-800',
        description: 'text-yellow-700',
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-400',
        title: 'text-red-800',
        description: 'text-red-700',
      },
    };

    const positions = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={`
          fixed
          ${positions[position]}
          flex
          w-full
          max-w-sm
          overflow-hidden
          rounded-lg
          border
          shadow-lg
          ${variants[variant].bg}
          ${variants[variant].border}
          ${className}
        `}
        {...props}
      >
        <div className="flex w-full p-4">
          {icon && (
            <div className={`flex-shrink-0 ${variants[variant].icon}`}>
              {icon}
            </div>
          )}
          <div className={`${icon ? 'ml-3' : ''} w-full`}>
            {title && (
              <div className={`font-medium ${variants[variant].title}`}>
                {title}
              </div>
            )}
            {description && (
              <div className={`mt-1 text-sm ${variants[variant].description}`}>
                {description}
              </div>
            )}
            {action && <div className="mt-3">{action}</div>}
          </div>
          {onClose && (
            <button
              type="button"
              className={`
                ml-4
                flex-shrink-0
                inline-flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                ${variants[variant].description}
                hover:bg-gray-200
                hover:text-gray-500
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
              `}
              onClick={() => {
                setIsVisible(false);
                onClose();
              }}
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

Toast.displayName = 'Toast';
