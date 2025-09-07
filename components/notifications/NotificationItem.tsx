import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function NotificationItem({ notification }: { notification: Notification }) {
  // Placeholder para un ícono según el tipo de notificación
  const icon = <div className="h-10 w-10 rounded-full bg-primary/10" />;

  return (
    <Link
      href={notification.actionUrl || '#'}
      className="block p-3 transition-colors hover:bg-accent"
    >
      <div className="flex items-start gap-4">
        {notification.actor?.avatar ? (
          <Avatar className="h-10 w-10">
            <AvatarImage src={notification.actor.avatar} />
            <AvatarFallback>{notification.actor.name?.charAt(0) || 'N'}</AvatarFallback>
          </Avatar>
        ) : (
          icon
        )}
        <div className="flex-1 space-y-1">
          <p className="text-sm text-foreground leading-snug" dangerouslySetInnerHTML={{ __html: notification.message }} />
          <p className="text-xs text-primary">
            {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: es })}
          </p>
        </div>
        {!notification.read && (
          <div className="h-2.5 w-2.5 rounded-full bg-primary self-center shrink-0" />
        )}
      </div>
    </Link>
  );
}
