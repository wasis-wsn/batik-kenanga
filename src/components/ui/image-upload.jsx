import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';
import { Label } from './label';
import { cn } from '@/lib/utils';

const ImageUpload = ({ 
  value, 
  onChange, 
  label = "Upload Image",
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  preview = true,
  className = "",
  disabled = false,
  multiple = false,
  ...props 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    
    // Validate file size
    for (const file of fileArray) {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
        return;
      }
    }

    if (multiple) {
      onChange(fileArray);
    } else {
      onChange(fileArray[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (indexToRemove = null) => {
    if (multiple && indexToRemove !== null) {
      const newFiles = value.filter((_, index) => index !== indexToRemove);
      onChange(newFiles);
    } else {
      onChange(null);
    }
  };

  const renderPreview = () => {
    if (!preview || !value) return null;

    if (multiple && Array.isArray(value)) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {value.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                {file instanceof File ? (
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={file} 
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      );
    }

    // Single image preview
    return (
      <div className="relative mt-4 w-48 h-48 mx-auto">
        <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100">
          {value instanceof File ? (
            <img 
              src={URL.createObjectURL(value)} 
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={value} 
              alt="Preview"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2"
          onClick={() => removeImage()}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-400"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          {...props}
        />
        
        <div className="text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              disabled={disabled || uploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : (multiple ? 'Choose Files' : 'Choose File')}
            </Button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {multiple ? 'Drag and drop files here, or click to select files' : 'Drag and drop a file here, or click to select a file'}
          </p>
          <p className="text-xs text-gray-400">
            Max size: {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </div>

      {renderPreview()}
    </div>
  );
};

export default ImageUpload;
