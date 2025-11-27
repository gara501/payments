import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  value?: string;
  onChange: (imageData: string | null, error?: string) => void;
  error?: string;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, error, disabled }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadError(null);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Please select a valid image file (PNG, JPG, GIF, WebP)';
      setUploadError(errorMsg);
      onChange(null, errorMsg);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = 'Image size must be less than 5MB';
      setUploadError(errorMsg);
      onChange(null, errorMsg);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setUploadError(null);
      onChange(result);
    };
    reader.onerror = () => {
      const errorMsg = 'Failed to read the image file';
      setUploadError(errorMsg);
      onChange(null, errorMsg);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleRemove = () => {
    setPreview(null);
    setUploadError(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-3">
      <label className="label">
        <span className="label-text font-semibold">
          Background Image
          <span className="text-gray-500 font-normal ml-1">(optional)</span>
        </span>
      </label>
      
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        
        {preview ? (
          /* Preview */
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="btn btn-circle btn-sm btn-error absolute top-2 right-2"
              disabled={disabled}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          /* Upload Prompt */
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF, WebP up to 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {(error || uploadError) && (
        <p className="text-sm text-error flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error || uploadError}
        </p>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        Upload an image to use as the background for this subscription card. The image will be resized and optimized automatically.
      </p>
    </div>
  );
}