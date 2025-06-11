import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const LoadingSpinner = ({ 
  size = "default", 
  className = "",
  text = "",
  fullScreen = false,
  ...props 
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  const spinner = (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={cn("animate-spin text-blue-600", sizeClasses[size])} {...props} />
        {text && (
          <p className="text-sm text-gray-600 animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

const LoadingCard = ({ 
  title = "Loading...", 
  description = "Please wait while we load the content.",
  className = "" 
}) => {
  return (
    <div className={cn("flex items-center justify-center min-h-64", className)}>
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

const LoadingTable = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={colIndex} 
              className="h-6 bg-gray-200 rounded animate-pulse flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export { LoadingSpinner, LoadingCard, LoadingTable };
export default LoadingSpinner;
