import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function ContentSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Settings</CardTitle>
        <CardDescription>
          Manage settings related to user-generated content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="max-video-length">Max Video Length (seconds)</Label>
          <Input id="max-video-length" type="number" defaultValue={60} />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="allow-comments">Allow Comments</Label>
            <p className="text-sm text-muted-foreground">
              Enable or disable comments on all videos.
            </p>
          </div>
          <Switch id="allow-comments" defaultChecked />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="auto-approve-comments">Auto-approve Comments</Label>
            <p className="text-sm text-muted-foreground">
              Automatically approve all new comments.
            </p>
          </div>
          <Switch id="auto-approve-comments" />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="enable-downloads">Enable Video Downloads</Label>
            <p className="text-sm text-muted-foreground">
              Allow users to download videos from the app.
            </p>
          </div>
          <Switch id="enable-downloads" defaultChecked />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
