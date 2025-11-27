import React from 'react';
import type { Subscription } from '../types/subscription';
import { getDaysLeft } from '../utils/dateHelpers';
import { 
  getCategoryBadgeClasses, 
  getStatusBadgeClasses, 
  getStatusText 
} from '../utils/designSystem';
import { formatCurrency } from '../utils/chartHelpers';

interface SubscriptionCardProps {
  subscription: Subscription;
  onDelete: (id: number) => void;
  onEdit: (subscription: Subscription) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onDelete,
  onEdit
}) => {
  const daysLeft = getDaysLeft(subscription.subscription_date);

  // Debug logging for background images
  React.useEffect(() => {
    if (subscription.background_image) {
      console.log(`🖼️ SubscriptionCard "${subscription.name}" has background image:`, subscription.background_image);
    } else {
      console.log(`🖼️ SubscriptionCard "${subscription.name}" has no background image`);
    }
  }, [subscription.background_image, subscription.name]);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${subscription.name}"?`)) {
      onDelete(subscription.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = () => {
    if (!subscription.is_active) return 'bg-gray-400';
    if (daysLeft === 0) return 'bg-red-500';
    if (daysLeft <= 10) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="card bg-white shadow-md border border-gray-200/50 overflow-hidden hover:shadow-2xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
      {/* Background Image */}
      <div
        className="h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden"
        style={{
          backgroundImage: subscription.background_image
            ? `url("${subscription.background_image}")`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Debug overlay to show when background image is not working */}
        {subscription.background_image && (
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            IMG: {subscription.background_image.split('/').pop()}
          </div>
        )}
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(subscription)}
            className="btn btn-circle btn-sm bg-white/90 hover:bg-white text-blue-600 hover:text-blue-700 border-0 shadow-lg"
            aria-label={`Edit ${subscription.name} subscription`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="btn btn-circle btn-sm bg-white/90 hover:bg-white text-red-600 hover:text-red-700 border-0 shadow-lg"
            aria-label={`Delete ${subscription.name} subscription`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body p-6">
        {/* Name and Category */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
            {subscription.name}
          </h3>
          {subscription.category && (
            <span className={`badge badge-sm font-medium ${getCategoryBadgeClasses(subscription.category)}`}>
              {subscription.category}
            </span>
          )}
        </div>

        {/* Date and Value */}
        <div className="flex justify-between items-start mb-4">
          <div className="text-sm text-gray-500">
            <span className="block font-medium text-gray-700">Started</span>
            {formatDate(subscription.subscription_date)}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(subscription.value)}
            </div>
            <div className="text-sm text-gray-500">per month</div>
          </div>
        </div>

        {/* Status and Days Left */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <span
              className={`badge gap-1 ${getStatusBadgeClasses(subscription.is_active, daysLeft)}`}
              aria-label={`Status: ${getStatusText(subscription.is_active, daysLeft)}`}
            >
              <span className={`w-2 h-2 rounded-full ${getStatusColor()}`}></span>
              {getStatusText(subscription.is_active, daysLeft)}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">
              {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
            </div>
            <div className="text-xs text-gray-500">
              {daysLeft > 0 ? 'until renewal' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};