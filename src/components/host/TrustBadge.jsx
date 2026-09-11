import React from 'react';
import { CheckCircle, ShieldCheck, Star, AlertCircle } from 'lucide-react';

export default function TrustBadge({ host, compact = false }) {
  const {
    identityVerified = false,
    gstVerified = false,
    trustScore = 0,
    completedEvents = 0,
    hostName = '',
  } = host || {};

  const isVerified = identityVerified;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {isVerified ? (
          <span className="inline-flex items-center gap-1 text-teal-600 text-xs font-semibold">
            <ShieldCheck size={14} className="fill-teal-100" />
            Verified Host
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
            <AlertCircle size={14} />
            Unverified
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-4 border border-teal-100">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">{hostName}</h4>
          <div className="mt-2 space-y-1.5">
            {identityVerified && (
              <div className="flex items-center gap-2 text-teal-600 text-xs font-medium">
                <CheckCircle size={13} />
                Identity Verified
              </div>
            )}
            {gstVerified && (
              <div className="flex items-center gap-2 text-teal-600 text-xs font-medium">
                <CheckCircle size={13} />
                GST Verified
              </div>
            )}
            {completedEvents > 0 && (
              <div className="flex items-center gap-2 text-gray-600 text-xs">
                <Star size={13} className="text-saffron-500" />
                {completedEvents} Completed Events
              </div>
            )}
            {trustScore > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-teal-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(trustScore, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  Trust Score {trustScore}/100
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
