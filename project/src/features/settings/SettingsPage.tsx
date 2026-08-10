import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import { studentsApi } from "@/api/studentsApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useTheme } from "@/components/ThemeProvider";
import { Loader2, Upload, Moon, Sun, User, KeyRound, Bell } from "lucide-react";

export default function SettingsPage() {
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const { theme, toggleTheme } = useTheme();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleAvatarChange = async (file: File | null) => {
    if (!file || !profile) return;
    setAvatarUploading(true);
    try {
      const url = await studentsApi.uploadAvatar(file, profile.id);
      setProfile({ ...profile, avatar_url: url });
      toast.success("Profile photo updated");
    } catch {
      toast.error("Could not upload photo");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleProfileSave = async () => {
    if (!profile) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone })
        .eq("id", profile.id);
      if (error) throw error;
      setProfile({ ...profile, full_name: fullName, phone });
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password changed");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Could not change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, password and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" /> Profile
          </CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar src={profile?.avatar_url} name={profile?.full_name ?? ""} size="xl" />
            <label>
              <Button type="button" variant="outline" size="sm" disabled={avatarUploading} asChild>
                <span>
                  {avatarUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Change photo
                </span>
              </Button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAvatarChange(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile?.email ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03xx-xxxxxxx" />
          </div>
          <Button onClick={handleProfileSave} disabled={savingProfile}>
            {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="h-4 w-4" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>New password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Confirm new password</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <Button onClick={handlePasswordChange} disabled={savingPassword}>
            {savingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
            Update password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} Theme
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Currently using {theme === "dark" ? "Dark" : "Light"} mode.</p>
          <Button variant="outline" onClick={toggleTheme}>
            Switch to {theme === "dark" ? "Light" : "Dark"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You'll receive in-app notifications for new assignments and attendance updates. Manage read/unread status from the Notifications page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
