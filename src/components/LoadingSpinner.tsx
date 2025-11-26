interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const combinedClassName = `relative ${sizeClasses[size]} ${className || ''}`;

  return (
    <div 
      className={combinedClassName}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
      {/* Outer ring */}
      <div className="absolute inset-0 border-4 border-[#D8E6F3] rounded-full" aria-hidden="true"></div>
      
      {/* Spinning ring */}
      <div className="absolute inset-0 border-4 border-transparent border-t-[#5B8FB9] rounded-full animate-spin" aria-hidden="true"></div>
      
      {/* Inner dot */}
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="w-1/3 h-1/3 bg-[#7FAFD9] rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export function LoadingOverlay({ message = 'Loading...', className }: LoadingOverlayProps) {
  const combinedClassName = `fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200 ${className || ''}`;
  
  return (
    <div 
      className={combinedClassName}
      role="alert"
      aria-live="assertive"
      aria-busy="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 border border-[#E5E7EB]">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="text-[#1F2937] font-medium animate-pulse" id="loading-message">{message}</p>
        )}
      </div>
    </div>
  );
}

interface InlineLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function InlineLoader({ message, size = 'md', className }: InlineLoaderProps) {
  const combinedClassName = `flex items-center gap-3 ${className || ''}`;
  
  return (
    <div className={combinedClassName} role="status" aria-live="polite">
      <LoadingSpinner size={size} />
      {message && (
        <span className="text-[#6B7280]" aria-label={message}>{message}</span>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFB]" role="alert" aria-live="assertive" aria-busy="true">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-4" />
        <p className="text-[#6B7280] animate-pulse" id="page-loading-message">Loading...</p>
      </div>
    </div>
  );
}
