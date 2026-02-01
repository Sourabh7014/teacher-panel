"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock session data
const sessions = [
  {
    id: "1",
    device: "Chrome on Windows",
    location: "Mumbai, India",
    ip: "192.168.1.1",
    lastActive: "5 minutes ago",
    current: true,
  },
  {
    id: "2",
    device: "Safari on iPhone",
    location: "Delhi, India",
    ip: "192.168.1.2",
    lastActive: "2 hours ago",
    current: false,
  },
];

export default function SessionManagement() {
  const handleRevoke = (sessionId: string) => {
    console.log("Revoking session:", sessionId);
    // Handle session revocation
  };

  const handleRevokeAll = () => {
    console.log("Revoking all sessions");
    // Handle revoking all sessions except current
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{session.device}</p>
                {session.current && (
                  <Badge variant="secondary">Current Session</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {session.location} • {session.ip}
              </p>
              <p className="text-xs text-muted-foreground">
                Last active: {session.lastActive}
              </p>
            </div>
            {!session.current && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRevoke(session.id)}
              >
                Revoke
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button variant="outline" onClick={handleRevokeAll}>
          Revoke All Other Sessions
        </Button>
      </div>
    </div>
  );
}
