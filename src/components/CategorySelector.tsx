import React, { useState, useRef, useEffect } from 'react';
import { SUBSCRIPTION_CATEGORIES, type SubscriptionCategory } from '../types/subscription';
import { getCategoryBadgeClasses, getCategoryIcon } from '../utils/designSystem';

export interface CategorySelectorProps {
  value: string;
  onChange: (category: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
}

/**
 * CategorySelector component for selecting subscription categories
 * Supports both predefined categories and custom input
 * Styled with modern design principles, ready for FlyonUI integration
 */
export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Select a category',
  disabled = false,
  required = false,
  error,
  label = 'Category',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if current value is a predefined category
  const isPredefinedCategory = SUBSCRIPTION_CATEGORIES.includes(value as SubscriptionCategory);

  // Initialize custom input if value is not predefined
  useEffect(() => {
    if (value && !isPredefinedCategory) {
      setShowCustomInput(true);
      setCustomValue(value);
    }
  }, [value, isPredefinedCategory]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle predefined category selection
  const handleCategorySelect = (category: string) => {
    onChange(category);
    setIsOpen(false);
    setShowCustomInput(false);
    setCustomValue('');
  };

  // Handle custom category input
  const handleCustomInput = () => {
    setShowCustomInput(true);
    setIsOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Handle custom value change
  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomValue(newValue);
    onChange(newValue);
  };

  // Handle custom input blur
  const handleCustomBlur = () => {
    if (!customValue.trim()) {
      setShowCustomInput(false);
      onChange('General');
    }
  };



  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Label */}
      <label className="label">
        <span className="label-text font-semibold">
          {label} {required && <span className="text-error">*</span>}
        </span>
      </label>

      {/* Custom Input Mode */}
      {showCustomInput ? (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={customValue}
            onChange={handleCustomValueChange}
            onBlur={handleCustomBlur}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowCustomInput(false);
                setCustomValue('');
                onChange('General');
              }
            }}
            className={`input input-bordered w-full bg-white font-medium ${error ? 'input-error' : ''} ${disabled ? 'cursor-not-allowed' : ''}`}
            placeholder="Enter custom category"
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => {
              setShowCustomInput(false);
              setCustomValue('');
              onChange('General');
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        /* Dropdown Mode */
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`btn btn-outline w-full justify-between font-medium ${error ? 'btn-error' : ''}`}
          >
            <div className="flex items-center space-x-3">
              {value ? (
                <>
                  <span className="text-xl">{getCategoryIcon(value)}</span>
                  <span className={`badge badge-lg font-medium border ${getCategoryBadgeClasses(value)}`}>
                    {value}
                  </span>
                </>
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-auto">
              {/* Predefined Categories */}
              <div className="py-2">
                {SUBSCRIPTION_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className={`
                      w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50
                      focus:outline-none transition-colors duration-150
                      flex items-center space-x-3
                      ${value === category ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                    `}
                  >
                    <span className="text-xl">{getCategoryIcon(category)}</span>
                    <div className="flex-1">
                      <div className="font-medium">{category}</div>
                      <div className="text-sm text-gray-500">
                        {category === 'Entertainment' && 'Netflix, Spotify, Disney+'}
                        {category === 'Productivity' && 'Office, Adobe, GitHub'}
                        {category === 'Health' && 'Fitness, Medical, Wellness'}
                        {category === 'Finance' && 'Banking, Investment, Budget'}
                        {category === 'General' && 'Other services'}
                      </div>
                    </div>
                    {value === category && (
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Category Option */}
              <div className="border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCustomInput}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 flex items-center space-x-3 text-gray-700"
                >
                  <span className="text-xl">✏️</span>
                  <div>
                    <div className="font-medium">Custom Category</div>
                    <div className="text-sm text-gray-500">Create your own category</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-error flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </p>
      )}

      {/* Help Text */}
      {!error && (
        <p className="mt-2 text-sm text-gray-500">
          Choose a category to organize your subscriptions or create a custom one.
        </p>
      )}
    </div>
  );
};