import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { notificationsApi } from "@/api/notificationsApi";
import type { Notification } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function NotificationsPage() {
  const profile = useAuthStore((s) => s.profile);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const data = await notificationsApi.listForUser(profile.id);
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [profile?.id]);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch {
      toast.error("Could not update notification");
    }
  };

  const handleMarkAllRead = async () => {
    if (!profile) return;
    try {
      await notificationsApi.markAllRead(profile.id);
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      toast.error("Could not update notifications");
    }
  };

  const unreadCount = items.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up."}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <BellOff className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">No notifications yet</p>
              <p className="text-sm text-muted-foreground">New assignments and attendance updates will show up here.</p>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-4 ${!n.is_read ? "bg-primary/5" : ""}`}
                  onClick={() => !n.is_read && handleMarkRead(n.id)}
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{n.title}</p>
                      {!n.is_read && <Badge>New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
