import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck, User } from 'lucide-react';
import { api } from '../../api/client';
import type { CandidateNotificationsResponse } from '../../api/types';
import { hrDecisionLabel } from '../../utils/format';
import { Button } from '../ui/Button';

export function CandidateNotificationBell({
  initials,
}: {
  initials?: string;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['candidate', 'notifications'],
    queryFn: () =>
      api.get<CandidateNotificationsResponse>('/candidate/notifications'),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

  const markRead = useMutation({
    mutationFn: (applicationId?: string) =>
      api.post<{ marked: number }>('/candidate/notifications/read', {
        ...(applicationId ? { applicationId } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'notifications'] });
    },
  });

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const unreadCount = data?.unreadCount ?? 0;
  const items = data?.items ?? [];

  const openItem = async (sessionId: string, applicationId: string, read: boolean) => {
    if (!read) {
      try {
        await markRead.mutateAsync(applicationId);
      } catch {
        /* still navigate */
      }
    }
    setOpen(false);
    navigate(`/my-applications/${sessionId}`);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/60 dark:text-indigo-300 dark:hover:bg-indigo-900"
        title="Application updates"
        aria-label={
          unreadCount > 0
            ? `${unreadCount} unread application update${unreadCount === 1 ? '' : 's'}`
            : 'Application updates'
        }
        aria-expanded={open}
      >
        <span className="sr-only">{initials ?? 'Notifications'}</span>
        <Bell className="h-4 w-4" aria-hidden />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Updates
            </p>
            {unreadCount > 0 && (
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                disabled={markRead.isPending}
                onClick={() => markRead.mutate(undefined)}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <p className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
                Loading…
              </p>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
                No employer decisions yet. When you are invited to interview or
                not selected, you will see it here.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item) => (
                  <li key={item.applicationId}>
                    <button
                      type="button"
                      className={`w-full px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 ${
                        !item.read ? 'bg-indigo-50/80 dark:bg-indigo-950/30' : ''
                      }`}
                      onClick={() =>
                        openItem(item.sessionId, item.applicationId, item.read)
                      }
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm ${
                            item.read
                              ? 'text-slate-700 dark:text-slate-300'
                              : 'font-medium text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {item.message}
                        </p>
                        {!item.read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {hrDecisionLabel(item.hrStatus)} ·{' '}
                        {item.hrDecidedAt
                          ? new Date(item.hrDecidedAt).toLocaleDateString()
                          : ''}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-slate-100 p-2 dark:border-slate-800">
            <Link
              to="/profile"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => setOpen(false)}
            >
              <User className="h-4 w-4" />
              Edit profile
            </Link>
            <Link
              to="/my-applications"
              className="mt-1 block w-full"
              onClick={() => setOpen(false)}
            >
              <Button variant="ghost" size="sm" className="w-full justify-start">
                View all applications
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
