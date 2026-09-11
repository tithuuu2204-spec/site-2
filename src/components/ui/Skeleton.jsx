import React from 'react';

// Skeleton loader components for loading states
export function SkeletonBox({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton h-4 rounded ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function ExperienceCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-52 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-1/3 rounded-full" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton h-6 w-20 rounded" />
          <div className="skeleton h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="skeleton h-96 w-full rounded-2xl mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <SkeletonText lines={2} />
          <SkeletonText lines={5} />
        </div>
        <div className="space-y-4">
          <div className="skeleton h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function TripPlanSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((d) => (
        <div key={d} className="card p-6 space-y-4">
          <div className="skeleton h-6 w-32 rounded" />
          {[1, 2, 3, 4].map((a) => (
            <div key={a} className="flex gap-4 items-start">
              <div className="skeleton h-12 w-12 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/2 rounded" />
                <div className="skeleton h-3 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
