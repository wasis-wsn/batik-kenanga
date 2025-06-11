import React from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={() => onOpenChange(false)}
      />
      {/* Dialog content */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className = "" }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export const DialogHeader = ({ children }) => {
  return (
    <div className="mb-4">
      {children}
    </div>
  );
};

export const DialogTitle = ({ children }) => {
  return (
    <h2 className="text-lg font-semibold text-gray-900">
      {children}
    </h2>
  );
};

export const DialogDescription = ({ children }) => {
  return (
    <p className="text-sm text-gray-600 mt-2">
      {children}
    </p>
  );
};

export const DialogFooter = ({ children }) => {
  return (
    <div className="flex justify-end gap-2 mt-6">
      {children}
    </div>
  );
};
