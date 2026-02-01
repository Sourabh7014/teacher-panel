import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function UserSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Settings</CardTitle>
        <CardDescription>
          Manage user registration and profile settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="allow-registration">
              Allow New User Registration
            </Label>
            <p className="text-sm text-muted-foreground">
              Control whether new users can sign up.
            </p>
          </div>
          <Switch id="allow-registration" defaultChecked />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="require-email-verification">
              Require Email Verification
            </Label>
            <p className="text-sm text-muted-foreground">
              Force new users to verify their email address.
            </p>
          </div>
          <Switch id="require-email-verification" defaultChecked />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
