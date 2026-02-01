import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SessionManagement from "@/features/profile/components/sessions";

export default function SessionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          Manage your active sessions and devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SessionManagement />
      </CardContent>
    </Card>
  );
}
