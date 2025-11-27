import React, { useState } from 'react';
import type { CreateSubscriptionInput } from '../types';
import { ImageUpload } from './ImageUpload';
import { CategorySelector } from './CategorySelector';

interface AddSubscriptionFormProps {
  onSubmit: (subscription: CreateSubscriptionInput) => Promise<boolean>;
  onCancel: () => void;
}

export function AddSubscriptionForm({ onSubmit, onCancel }: AddSubscriptionFormProps) {
  const [formData, setFormData] = useState<CreateSubscriptionInput>({
    name: '',
    subscription_date: '',
    value: 0,
    is_active: true,
    background_image: '',
    category: 'General',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateSubscriptionInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateSubscriptionInput, string>> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be 100 characters or less';
    }

    // Subscription date validation
    if (!formData.subscription_date) {
      newErrors.subscription_date = 'Subscription date is required';
    } else {
      const date = new Date(formData.subscription_date);
      if (isNaN(date.getTime())) {
        newErrors.subscription_date = 'Please enter a valid date';
      } else {
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(today.getFullYear() + 1);
        
        if (date < oneYearAgo) {
          newErrors.subscription_date = 'Date cannot be more than 1 year in the past';
        } else if (date > oneYearFromNow) {
          newErrors.subscription_date = 'Date cannot be more than 1 year in the future';
        }
      }
    }

    // Value validation
    if (formData.value <= 0) {
      newErrors.value = 'Value must be greater than 0';
    } else if (formData.value > 99999.99) {
      newErrors.value = 'Value cannot exceed $99,999.99';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.value.toString())) {
      newErrors.value = 'Value can have at most 2 decimal places';
    }

    // Category validation
    if (!formData.category || !formData.category.trim()) {
      newErrors.category = 'Category is required';
    } else if (formData.category.trim().length > 50) {
      newErrors.category = 'Category must be 50 characters or less';
    }

    // Background image validation (optional field)
    if (formData.background_image && formData.background_image.trim()) {
      // For uploaded images (data URLs), validate the data URL format
      if (formData.background_image.startsWith('data:image/')) {
        // Basic data URL validation
        if (!formData.background_image.includes(',')) {
          newErrors.background_image = 'Invalid image data';
        }
      } else {
        // For URL-based images, validate URL format
        try {
          new URL(formData.background_image);
          // Check if it's a reasonable image URL
          const url = formData.background_image.toLowerCase();
          if (!url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/)) {
            newErrors.background_image = 'Please provide a valid image URL (jpg, png, gif, webp, svg)';
          }
        } catch {
          newErrors.background_image = 'Please enter a valid URL';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(formData);
      if (success) {
        // Reset form on successful submission
        setFormData({
          name: '',
          subscription_date: '',
          value: 0,
          is_active: true,
          background_image: '',
          category: 'General',
        });
        setErrors({});
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateSubscriptionInput, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="label">
          <span className="label-text font-semibold">Subscription Name *</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`input input-bordered w-full bg-white ${errors.name ? 'input-error' : ''}`}
          placeholder="Enter subscription name"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-2 text-sm text-error flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.name}
          </p>
        )}
      </div>

      {/* Subscription Date Field */}
      <div>
        <label htmlFor="subscription_date" className="label">
          <span className="label-text font-semibold">Start Date *</span>
        </label>
        <input
          type="date"
          id="subscription_date"
          value={formData.subscription_date}
          onChange={(e) => handleInputChange('subscription_date', e.target.value)}
          className={`input input-bordered w-full bg-white ${errors.subscription_date ? 'input-error' : ''}`}
          disabled={isSubmitting}
        />
        {errors.subscription_date && (
          <p className="mt-2 text-sm text-error flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.subscription_date}
          </p>
        )}
      </div>

      {/* Value Field */}
      <div>
        <label htmlFor="value" className="label">
          <span className="label-text font-semibold">Monthly Cost *</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-500 text-lg">$</span>
          </div>
          <input
            type="number"
            id="value"
            min="0"
            step="0.01"
            value={formData.value}
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty string for better UX while typing
              if (value === '') {
                handleInputChange('value', 0);
              } else {
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                  handleInputChange('value', numValue);
                }
              }
            }}
            className={`input input-bordered w-full pl-8 bg-white ${errors.value ? 'input-error' : ''}`}
            placeholder="0.00"
            disabled={isSubmitting}
          />
        </div>
        {errors.value && (
          <p className="mt-2 text-sm text-error flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.value}
          </p>
        )}
      </div>

      {/* Category Selection */}
      <CategorySelector
        value={formData.category || ''}
        onChange={(category) => handleInputChange('category', category)}
        label="Category"
        required={true}
        error={errors.category}
        disabled={isSubmitting}
        placeholder="Select a category for this subscription"
      />

      {/* Background Image Upload */}
      <ImageUpload
        value={formData.background_image}
        onChange={(imageData, error) => {
          handleInputChange('background_image', imageData || '');
          if (error) {
            setErrors(prev => ({
              ...prev,
              background_image: error
            }));
          }
        }}
        error={errors.background_image}
        disabled={isSubmitting}
      />

      {/* Is Active Field */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => handleInputChange('is_active', e.target.checked)}
            className="checkbox checkbox-primary"
            disabled={isSubmitting}
          />
          <div>
            <span className="label-text font-semibold text-gray-900">Active Subscription</span>
            <p className="text-xs text-gray-700">Enable this subscription for tracking and notifications</p>
          </div>
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </>
          ) : (
            'Add Subscription'
          )}
        </button>
      </div>
    </form>
  );
}