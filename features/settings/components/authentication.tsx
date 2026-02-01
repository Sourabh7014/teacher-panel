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

export function AuthenticationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Login Methods</CardTitle>
          <CardDescription>
            Configure how users can sign in to your application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="enable-google-login">Enable Google Login</Label>
              <p className="text-sm text-muted-foreground">
                Allow users to sign in with their Google account.
              </p>
            </div>
            <Switch id="enable-google-login" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="enable-apple-login">Enable Apple Login</Label>
              <p className="text-sm text-muted-foreground">
                Allow users to sign in with their Apple ID.
              </p>
            </div>
            <Switch id="enable-apple-login" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="enable-facebook-login">
                Enable Facebook Login
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow users to sign in with their Facebook account.
              </p>
            </div>
            <Switch id="enable-facebook-login" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recovery Methods</CardTitle>
          <CardDescription>
            Configure how users can recover their accounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="enable-email-recovery">
                Enable Email Recovery
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow users to reset their password via email.
              </p>
            </div>
            <Switch id="enable-email-recovery" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="enable-phone-recovery">
                Enable Phone Recovery
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow users to reset their password via phone number.
              </p>
            </div>
            <Switch id="enable-phone-recovery" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="enable-security-questions">
                Enable Security Questions
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable security questions for users.
              </p>
            </div>
            <Switch id="enable-security-questions" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
