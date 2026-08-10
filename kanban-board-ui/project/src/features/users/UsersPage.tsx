import { useEffect, useState } from "react";
import { usersApi } from "@/api/usersApi";
import type { Profile, UserRole } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

const roleBadge: Record<UserRole, "default" | "secondary" | "success" | "warning"> = {
  super_admin: "warning",
  admin: "default",
  teacher: "secondary",
  student: "success",
};

export default function UsersPage() {
  const currentProfile = useAuthStore((s) => s.profile);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await usersApi.list();
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRoleChange = async (userId: string, role: UserRole) => {
    try {
      await usersApi.updateRole(userId, role);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      toast.success("Role updated");
    } catch {
      toast.error("Only Super Admins can change roles, or this update was blocked by security rules.");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Manage Users</h1>
        <p className="text-sm text-muted-foreground">View all users and manage their roles.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <UsersIcon className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">No users found</p>
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={u.avatar_url} name={u.full_name} size="sm" />
                    <div>
                      <p className="text-sm font-medium">{u.full_name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={roleBadge[u.role]}>{u.role.replace("_", " ")}</Badge>
                    {(currentProfile?.role === "admin" || currentProfile?.role === "super_admin") && currentProfile.id !== u.id && (
                      <Select value={u.role} onValueChange={(v) => handleRoleChange(u.id, v as UserRole)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
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
