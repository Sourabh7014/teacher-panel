import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NotificationSettings from "@/features/profile/components/settings";

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email & Notification Settings</CardTitle>
        <CardDescription>
          Manage how you receive notifications and emails
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NotificationSettings />
      </CardContent>
    </Card>
  );
}
