import React, { useState } from 'react';
import { CategorySelector } from './CategorySelector';

/**
 * Demo component to showcase CategorySelector functionality
 */
export const CategorySelectorDemo: React.FC = () => {
  const [category1, setCategory1] = useState('');
  const [category2, setCategory2] = useState('Entertainment');
  const [category3, setCategory3] = useState('Custom Category');
  const [category4, setCategory4] = useState('');
  const [hasError, setHasError] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CategorySelector Demo</h1>
        <p className="text-gray-600">Interactive examples of the CategorySelector component</p>
      </div>

      <div className="grid gap-8">
        {/* Basic Usage */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Usage</h2>
          <CategorySelector
            value={category1}
            onChange={setCategory1}
            placeholder="Choose a category"
          />
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Selected: <span className="font-medium">{category1 || 'None'}</span>
            </p>
          </div>
        </div>

        {/* Pre-selected Category */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pre-selected Category</h2>
          <CategorySelector
            value={category2}
            onChange={setCategory2}
            label="Subscription Category"
          />
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Selected: <span className="font-medium">{category2}</span>
            </p>
          </div>
        </div>

        {/* Custom Category */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Custom Category</h2>
          <CategorySelector
            value={category3}
            onChange={setCategory3}
            label="Custom Category Example"
          />
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Selected: <span className="font-medium">{category3}</span>
            </p>
          </div>
        </div>

        {/* Required with Error */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Required with Validation</h2>
          <CategorySelector
            value={category4}
            onChange={(value) => {
              setCategory4(value);
              setHasError(!value);
            }}
            label="Required Category"
            required={true}
            error={hasError ? 'Please select a category' : ''}
          />
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Selected: <span className="font-medium">{category4 || 'None'}</span>
            </p>
          </div>
        </div>

        {/* Disabled State */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Disabled State</h2>
          <CategorySelector
            value="Productivity"
            onChange={() => { }}
            label="Disabled Category"
            disabled={true}
          />
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              This selector is disabled and cannot be changed.
            </p>
          </div>
        </div>
      </div>

      {/* Category Information */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Available Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🎬</span>
              <span className="font-medium">Entertainment</span>
              <span className="text-sm text-gray-600">- Netflix, Spotify, Disney+</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">💼</span>
              <span className="font-medium">Productivity</span>
              <span className="text-sm text-gray-600">- Office, Adobe, GitHub</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">🏥</span>
              <span className="font-medium">Health</span>
              <span className="text-sm text-gray-600">- Fitness, Medical, Wellness</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">💰</span>
              <span className="font-medium">Finance</span>
              <span className="text-sm text-gray-600">- Banking, Investment, Budget</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">📋</span>
              <span className="font-medium">General</span>
              <span className="text-sm text-gray-600">- Other services</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">✏️</span>
              <span className="font-medium">Custom</span>
              <span className="text-sm text-gray-600">- Create your own</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};