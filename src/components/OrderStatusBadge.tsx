'use client';

import React from 'react';
import { OrderStatus } from '@/lib/db';
import { Clock, PlayCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const config = {
    submitted: {
      label: 'Submitted',
      icon: Clock,
      bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
      dot: 'bg-amber-500 animate-pulse',
      desc: 'Order received. Awaiting production kickoff in studio.',
    },
    in_production: {
      label: 'In production',
      icon: PlayCircle,
      bg: 'bg-blue-50 text-blue-800 border-blue-200/80',
      dot: 'bg-blue-600 animate-pulse',
      desc: 'Our studio is actively directing and rendering your video ad.',
    },
    ready: {
      label: 'Ready',
      icon: CheckCircle2,
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      dot: 'bg-emerald-600',
      desc: 'Video rendered! You can stream your ad and download the MP4.',
    },
    failed: {
      label: 'Failed',
      icon: AlertCircle,
      bg: 'bg-rose-50 text-rose-800 border-rose-200/80',
      dot: 'bg-rose-600',
      desc: 'Creative direction or video rendering failed. See details below.',
    },
  }[status] || {
    label: 'Processing',
    icon: Clock,
    bg: 'bg-stone-50 text-stone-800 border-stone-200',
    dot: 'bg-stone-400',
    desc: 'Status updating...',
  };

  const Icon = config.icon;

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`p-4 rounded-2xl border ${config.bg} flex items-start gap-3`}>
        <div className="p-2 rounded-xl bg-white/80 border border-current/20 shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-wide">{config.label}</span>
            <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          </div>
          <p className="text-xs opacity-90">{config.desc}</p>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

