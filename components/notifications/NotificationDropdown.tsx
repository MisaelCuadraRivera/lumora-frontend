'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getNotificationsByUser, markAllAsRead } from '@/data/notifications';
import type { Notification } from '@/types';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

export function NotificationDropdown() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const userNotifications = getNotificationsByUser(user.id);
      setNotifications(userNotifications);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    if (!user) return;
    markAllAsRead(user.id);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const recentNotifications = notifications.slice(0, 8);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="p-2 border-b flex justify-between items-center">
          <h3 className="text-base font-semibold px-2">Notificaciones</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleMarkAllAsRead} disabled={unreadCount === 0} className="h-8 w-8">
                  <CheckCheck className="h-4 w-4" />
                  <span className="sr-only">Marcar todas como leídas</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Marcar todas como leídas</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ScrollArea className="h-[400px]">
          {recentNotifications.length > 0 ? (
            <div>
              {recentNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-8">
              <p>No tienes notificaciones nuevas.</p>
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t bg-muted/50 text-center">
          <Link href="/notifications">
            <Button variant="link" className="w-full text-sm">
              Ver todas las notificaciones
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}