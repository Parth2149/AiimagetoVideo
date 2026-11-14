'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import {
  Lock,
  Download,
  Copy,
  ExternalLink,
  Upload,
  PlayCircle,
  Check,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Sparkles,
  AlertCircle,
  Eye,
  Film,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface AdminOrder {
  id: string;
  token: string;
  status: 'submitted' | 'in_production' | 'ready';
  brief: string;
  photo_filename: string;
  photo_original_name: string;
  photo_size: number;
  video_filename: string | null;
  video_original_name: string | null;
  video_size: number | null;
  created_at: number;
  updated_at: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Notifications / feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploadingOrderId, setUploadingOrderId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    setOrdersError(null);
    try {
      const res = await fetch('/api/orders');
      if (res.status === 401) {
        setIsAuthenticated(false);
        setOrders([]);
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to retrieve orders.');
      }
      const data = await res.json();
      setOrders(data.orders || []);
      setIsAuthenticated(true);
    } catch (err: any) {
      setOrdersError(err.message || 'Error fetching orders.');
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      setIsAuthenticated(true);
      setPasswordInput('');
      fetchOrders();
    } catch (err: any) {
      setLoginError(err.message || 'Invalid administrator password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {}
    setIsAuthenticated(false);
    setOrders([]);
  };

  const copyBrief = (brief: string) => {
    navigator.clipboard.writeText(brief);
    showToast('Creative brief copied to clipboard!');
  };

  const openGeminiTask = (order: AdminOrder) => {
    // Copy helpful prompt to clipboard for operator convenience
    const promptText = `Creative Brief for Video Ad:\n${order.brief}\n\nPlease generate a 10-second vertical (9:16) video ad for this product based on the brief.`;
    navigator.clipboard.writeText(promptText);

    // Open Gemini App
    window.open('https://gemini.google.com/app', '_blank', 'noopener,noreferrer');
    showToast('Opened Gemini Apps! Production prompt copied to clipboard.');
  };

  const markInProduction = async (orderId: string) => {
    setUpdatingStatusId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_production' }),
      });
      if (!res.ok) {
        throw new Error('Failed to update status.');
      }
      showToast('Order marked as In production.');
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Status update failed.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleVideoUpload = async (orderId: string, file: File) => {
    if (!file.name.toLowerCase().endsWith('.mp4') && file.type !== 'video/mp4') {
      alert('Please upload an MP4 file.');
      return;
    }

    setUploadingOrderId(orderId);
    try {
      const formData = new FormData();
      formData.append('video', file);

      const res = await fetch(`/api/admin/orders/${orderId}/upload-video`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload video.');
      }

      showToast('MP4 uploaded! Order is now Ready for the customer.');
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Video upload failed.');
    } finally {
      setUploadingOrderId(null);
    }
  };

  // State 1: Checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <RefreshCw className="w-6 h-6 animate-spin text-ink-muted mb-3" />
        <p className="text-sm text-ink-secondary">Verifying operator session...</p>
      </div>
    );
  }

  // State 2: Login Screen
  if (!isAuthenticated) {
    return (
      <div className="flex-1 max-w-md w-full mx-auto px-4 py-16 flex flex-col justify-center">
        <div className="bg-white p-7 sm:p-8 rounded-3xl border border-border shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-canvas-subtle border border-border flex items-center justify-center mx-auto text-ink shadow-sm">
              <Lock className="w-5 h-5 text-accent-blue" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Operator Portal</h1>
            <p className="text-xs text-ink-muted">
              Enter the administrator password to manage manual fulfillment orders.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="adminPassword" className="text-xs font-semibold text-ink-secondary block">
                Administrator Password
              </label>
              <input
                id="adminPassword"
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password"
                className="w-full rounded-xl border border-border bg-[#FDFCFB] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/15"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn-glossy w-full py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-ink-muted text-center pt-2">
            Configured via <code className="font-mono bg-canvas-subtle px-1 py-0.5 rounded">ADMIN_PASSWORD</code> in your environment.
          </p>
        </div>
      </div>
    );
  }

  // State 3: Admin Dashboard
  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 lg:py-12">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-white px-4 py-3 rounded-2xl shadow-floating text-xs font-medium flex items-center gap-2.5 border border-white/20 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-accent-peach" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs uppercase font-mono font-semibold text-emerald-800 tracking-wider">
              Operator Session Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
            Fulfillment Dashboard
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Manual fulfillment workflow via the Task tab in Gemini Apps.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchOrders()}
            disabled={loadingOrders}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white border border-border hover:bg-stone-50 text-ink shadow-sm transition-all"
            title="Refresh order list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white border border-border hover:bg-red-50 hover:text-red-700 text-ink-secondary shadow-sm transition-all"
            title="Sign out of operator admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            Recent Orders ({orders.length})
          </h2>
          <span className="text-xs text-ink-muted">
            Ordered by newest first
          </span>
        </div>

        {ordersError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
            {ordersError}
          </div>
        )}

        {orders.length === 0 && !loadingOrders ? (
          <div className="bg-white rounded-3xl border border-border p-12 text-center space-y-3">
            <Film className="w-10 h-10 mx-auto text-ink-muted opacity-40" />
            <h3 className="text-base font-medium text-ink">No orders yet</h3>
            <p className="text-xs text-ink-muted max-w-sm mx-auto">
              When customers submit product photos and creative briefs from the homepage, their orders will appear here.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-blue hover:underline"
              >
                <span>Go to homepage to place a test order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const photoUrl = `/api/media/photos/${order.photo_filename}`;
              const downloadPhotoUrl = `/api/media/photos/${order.photo_filename}?download=1&name=${encodeURIComponent(
                order.photo_original_name
              )}`;
              const videoUrl = order.video_filename
                ? `/api/media/videos/${order.video_filename}`
                : null;
              const isUploading = uploadingOrderId === order.id;
              const isUpdatingStatus = updatingStatusId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-border/90 shadow-card p-5 sm:p-6 transition-all hover:border-border-strong/70"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left: Thumbnail and customer page link */}
                    <div className="lg:col-span-3 flex flex-col gap-3">
                      <div className="relative aspect-[9/16] max-w-[150px] w-full rounded-2xl overflow-hidden bg-stone-100 border border-border shadow-sm group">
                        <img
                          src={photoUrl}
                          alt={order.photo_original_name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <a
                            href={downloadPhotoUrl}
                            download={order.photo_original_name}
                            className="p-2 rounded-xl bg-white/90 text-ink hover:bg-white shadow"
                            title="Download original photo"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      <div className="text-xs space-y-1">
                        <p className="font-medium text-ink truncate" title={order.photo_original_name}>
                          {order.photo_original_name}
                        </p>
                        <p className="text-ink-muted text-[11px]">
                          {(order.photo_size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <Link
                          href={`/orders/${order.token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-accent-blue hover:underline pt-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View customer page</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Middle: Brief and Details */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-ink px-2 py-0.5 rounded bg-canvas-subtle border border-border">
                          {order.id}
                        </span>
                        <OrderStatusBadge status={order.status} size="sm" />
                        <span className="text-xs text-ink-muted">
                          {new Date(order.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>

                      {/* Brief text box */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted block">
                          Creative Brief
                        </span>
                        <div className="p-3.5 rounded-2xl bg-canvas-subtle border border-border/70 text-xs font-sans text-ink leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto">
                          {order.brief}
                        </div>
                      </div>

                      {/* Current Video Info if Ready */}
                      {order.status === 'ready' && order.video_filename && (
                        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span className="font-medium truncate max-w-[200px]">
                              {order.video_original_name || 'Finished MP4'}
                            </span>
                          </div>
                          <a
                            href={`/api/media/videos/${order.video_filename}?download=1`}
                            className="font-semibold underline hover:text-emerald-950 flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Right: Operator Action Center */}
                    <div className="lg:col-span-4 bg-canvas-subtle/80 p-4 rounded-2xl border border-border/70 space-y-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-ink-secondary block">
                        Fulfillment Actions
                      </span>

                      {/* Action 1: Download Photo */}
                      <a
                        href={downloadPhotoUrl}
                        download={order.photo_original_name}
                        className="w-full py-2 px-3 rounded-xl bg-white border border-border hover:bg-stone-50 text-xs font-medium text-ink flex items-center justify-between shadow-sm transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <Download className="w-3.5 h-3.5 text-ink-muted" />
                          <span>Download Photo</span>
                        </span>
                        <span className="text-[10px] text-ink-muted font-mono">JPG/PNG</span>
                      </a>

                      {/* Action 2: Copy Brief */}
                      <button
                        type="button"
                        onClick={() => copyBrief(order.brief)}
                        className="w-full py-2 px-3 rounded-xl bg-white border border-border hover:bg-stone-50 text-xs font-medium text-ink flex items-center justify-between shadow-sm transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <Copy className="w-3.5 h-3.5 text-ink-muted" />
                          <span>Copy Brief</span>
                        </span>
                        <span className="text-[10px] text-ink-muted font-mono">Clipboard</span>
                      </button>

                      {/* Action 3: Open Gemini (Task tab workflow) */}
                      <button
                        type="button"
                        onClick={() => openGeminiTask(order)}
                        className="w-full py-2 px-3 rounded-xl bg-blue-50 border border-blue-200/80 hover:bg-blue-100/70 text-xs font-medium text-blue-900 flex items-center justify-between shadow-sm transition-all group"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-accent-blue" />
                          <span className="font-semibold">Open Gemini</span>
                        </span>
                        <ExternalLink className="w-3 h-3 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      <div className="pt-1 border-t border-border/60" />

                      {/* Action 4: Mark In Production (if submitted) */}
                      {order.status === 'submitted' && (
                        <button
                          type="button"
                          onClick={() => markInProduction(order.id)}
                          disabled={isUpdatingStatus}
                          className="w-full py-2 px-3 rounded-xl bg-white border border-amber-300 hover:bg-amber-50 text-xs font-semibold text-amber-900 flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <PlayCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>{isUpdatingStatus ? 'Updating...' : 'Mark In Production'}</span>
                        </button>
                      )}

                      {/* Action 5: Upload Finished MP4 */}
                      <div>
                        <input
                          ref={(el) => {
                            fileInputRefs.current[order.id] = el;
                          }}
                          type="file"
                          accept="video/mp4,.mp4"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleVideoUpload(order.id, e.target.files[0]);
                            }
                          }}
                        />

                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => fileInputRefs.current[order.id]?.click()}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all ${
                            order.status === 'ready'
                              ? 'bg-white border border-border text-ink hover:bg-stone-50'
                              : 'btn-glossy text-white'
                          }`}
                        >
                          {isUploading ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading MP4...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>
                                {order.status === 'ready'
                                  ? 'Re-upload Finished MP4'
                                  : 'Upload Finished MP4'}
                              </span>
                            </>
                          )}
                        </button>
                        <p className="text-[10px] text-ink-muted text-center mt-1">
                          Uploading automatically marks order as <span className="font-semibold text-emerald-700">Ready</span>
                        </p>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

