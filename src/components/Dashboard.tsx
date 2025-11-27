import React, { useState, useEffect } from 'react';
import { SubscriptionCard } from './SubscriptionCard';
import { AddSubscriptionForm } from './AddSubscriptionForm';
import { EditSubscriptionForm } from './EditSubscriptionForm';
import { useSubscriptions } from '../hooks/useSubscriptions';
import type { CreateSubscriptionInput, Subscription } from '../types';

export const Dashboard: React.FC = () => {
  const {
    visibleSubscriptions,
    loading,
    error,
    hasMore,
    storageInfo,
    add: addSubscription,
    update: updateSubscription,
    delete: deleteSubscription,
    loadMore,
  } = useSubscriptions();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Trigger animation when modal opens
  useEffect(() => {
    if (isAddModalOpen || isEditModalOpen) {
      // Small delay to ensure DOM is ready for animation
      const timer = setTimeout(() => {
        setIsModalAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isAddModalOpen, isEditModalOpen]);

  const handleDeleteSubscription = async (id: number) => {
    await deleteSubscription(id);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsEditModalOpen(true);
    setIsModalAnimating(false);
  };

  const handleAddSubscription = () => {
    setIsAddModalOpen(true);
    setIsModalAnimating(false);
  };

  const handleSubmitSubscription = async (subscription: CreateSubscriptionInput): Promise<boolean> => {
    const success = await addSubscription(subscription);
    if (success) {
      setIsModalAnimating(false);
      // Delay closing the modal to allow exit animation
      setTimeout(() => {
        setIsAddModalOpen(false);
      }, 200);
    }
    // Note: Error handling is now done in useSubscriptions hook with toast notifications
    return success;
  };

  const handleSubmitEditSubscription = async (id: number, subscription: CreateSubscriptionInput): Promise<boolean> => {
    const success = await updateSubscription(id, subscription);
    if (success) {
      setIsModalAnimating(false);
      // Delay closing the modal to allow exit animation
      setTimeout(() => {
        setIsEditModalOpen(false);
        setEditingSubscription(null);
      }, 200);
    }
    return success;
  };

  const handleCancelAddSubscription = () => {
    setIsModalAnimating(false);
    // Delay closing the modal to allow exit animation
    setTimeout(() => {
      setIsAddModalOpen(false);
    }, 200);
  };

  const handleCancelEditSubscription = () => {
    setIsModalAnimating(false);
    // Delay closing the modal to allow exit animation
    setTimeout(() => {
      setIsEditModalOpen(false);
      setEditingSubscription(null);
    }, 200);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate a brief loading state for smooth UX
    setTimeout(() => {
      loadMore();
      setIsLoadingMore(false);
    }, 300);
  };

  // Skeleton loader component for subscription cards
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header skeleton */}
          <header className="mb-12 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
              <div className="flex-1 space-y-4">
                <div className="h-14 bg-white/50 rounded-xl w-3/4 animate-pulse"></div>
                <div className="h-6 bg-white/50 rounded-lg w-full max-w-2xl animate-pulse"></div>
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-8 bg-white/50 rounded-lg w-32 animate-pulse"></div>
                  <div className="h-8 bg-white/50 rounded-lg w-40 animate-pulse"></div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="h-16 bg-white/50 rounded-xl w-56 animate-pulse"></div>
              </div>
            </div>
          </header>

          {/* Loading spinner with enhanced animation */}
          <div className="flex justify-center items-center min-h-96 mb-12">
            <div className="text-center">
              <div className="relative mb-8">
                {/* Outer rotating ring */}
                <div className="animate-spin rounded-full h-24 w-24 border-4 border-blue-200 border-t-blue-600 mx-auto shadow-lg"></div>
                {/* Inner pulsing ring */}
                <div className="absolute inset-0 rounded-full h-24 w-24 border-4 border-blue-100 opacity-25 mx-auto animate-pulse"></div>
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="space-y-2 animate-fade-in">
                <p className="text-gray-700 font-semibold text-lg">Loading your subscriptions...</p>
                <p className="text-gray-500 text-sm">Please wait a moment</p>
              </div>
            </div>
          </div>

          {/* Skeleton cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <SkeletonCard />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-800 font-semibold text-lg mb-2">Error loading subscriptions</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Professional Header with Improved Typography */}
        <header className="mb-12">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
            {/* Title and Description Section */}
            <div className="flex-1">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-3 tracking-tight leading-tight">
                Subscription Manager
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-medium">
                Track your subscriptions, monitor renewals, and manage your recurring expenses all in one place
              </p>
              
              {/* Status Indicator */}
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className={`w-2 h-2 rounded-full ${storageInfo.isWorking ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                  <span className="text-sm text-gray-700 font-medium">
                    Supabase
                  </span>
                </div>
                <div className="px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-sm text-blue-700 font-semibold">
                    {storageInfo.stats.totalCount} {storageInfo.stats.totalCount === 1 ? 'subscription' : 'subscriptions'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button Section */}
            <div className="flex-shrink-0">
              <button
                onClick={handleAddSubscription}
                className="btn btn-primary btn-lg w-full sm:w-auto gap-3"
                aria-label="Add new subscription to your list"
                title="Add a new subscription"
                type="button"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  role="img"
                  focusable="false"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
                <span>Add Subscription</span>
              </button>
            </div>
          </div>
        </header>

        {/* Subscriptions Grid - Modern Card Layout with Proper Spacing */}
        {visibleSubscriptions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-12 auto-rows-fr">
              {visibleSubscriptions.map((subscription, index) => (
                <div
                  key={subscription.id}
                  className="animate-fade-in-up"
                  style={{ 
                    animationDelay: `${Math.min(index * 50, 500)}ms`,
                    opacity: 0
                  }}
                >
                  <SubscriptionCard
                    subscription={subscription}
                    onDelete={handleDeleteSubscription}
                    onEdit={handleEditSubscription}
                  />
                </div>
              ))}
            </div>

            {/* View More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="btn btn-outline px-10 py-4 gap-3"
                  aria-label="Load 5 more subscriptions"
                >
                  {isLoadingMore ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    'View More (+5)'
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 lg:py-24">
            <div className="bg-white rounded-3xl p-12 lg:p-20 shadow-xl border border-gray-100 max-w-3xl mx-auto transform transition-all duration-300 hover:shadow-2xl">
              {/* Illustration Container with Animation */}
              <div className="mb-10 relative">
                {/* Decorative Background Circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 bg-blue-50 rounded-full animate-pulse opacity-50"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-blue-100 rounded-full animate-pulse opacity-30" style={{ animationDelay: '0.5s' }}></div>
                </div>
                
                {/* Main Icon */}
                <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                  <svg 
                    className="w-16 h-16 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                    />
                  </svg>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-0 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute top-8 right-1/4 w-2 h-2 bg-blue-300 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.4s' }}></div>
                <div className="absolute bottom-8 left-1/3 w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.6s' }}></div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
                  Start Tracking Your Subscriptions
                </h3>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl mx-auto font-medium">
                  Take control of your recurring expenses. Add your first subscription and never miss a renewal date again.
                </p>
                
                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 mb-10 text-left">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Track Renewals</h4>
                      <p className="text-sm text-gray-600">Never miss a payment date</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Monitor Spending</h4>
                      <p className="text-sm text-gray-600">See your total expenses</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Organize by Category</h4>
                      <p className="text-sm text-gray-600">Group similar services</p>
                    </div>
                  </div>
                </div>

                {/* Call to Action Button */}
                <button
                  onClick={handleAddSubscription}
                  className="btn btn-primary btn-lg px-12 py-6 text-xl gap-3 shadow-xl"
                  aria-label="Add your first subscription"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Your First Subscription
                </button>
                
                {/* Helper Text */}
                <p className="text-sm text-gray-500 mt-6">
                  It only takes a minute to get started
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add Subscription Modal */}
        {isAddModalOpen && (
          <div 
            className={`fixed inset-0 bg-black flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out ${
              isModalAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
            }`}
          >
            <div 
              className={`bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out shadow-2xl ${
                isModalAnimating 
                  ? 'opacity-100 scale-100 translate-y-0' 
                  : 'opacity-0 scale-95 translate-y-4'
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Subscription</h2>
              <AddSubscriptionForm
                onSubmit={handleSubmitSubscription}
                onCancel={handleCancelAddSubscription}
              />
            </div>
          </div>
        )}

        {/* Edit Subscription Modal */}
        {isEditModalOpen && editingSubscription && (
          <div 
            className={`fixed inset-0 bg-black flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out ${
              isModalAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
            }`}
          >
            <div 
              className={`bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out shadow-2xl ${
                isModalAnimating 
                  ? 'opacity-100 scale-100 translate-y-0' 
                  : 'opacity-0 scale-95 translate-y-4'
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Subscription</h2>
              <EditSubscriptionForm
                subscription={editingSubscription}
                onSubmit={handleSubmitEditSubscription}
                onCancel={handleCancelEditSubscription}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};