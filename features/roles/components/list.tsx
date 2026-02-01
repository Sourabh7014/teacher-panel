"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";
import { permissions, roles as initialRoles, type Role } from "../data";
import * as React from "react";
import { Switch } from "@/components/ui/switch";
import RoleCreate from "./create";
import { useModal } from "@/hooks/use-modal";
import { useConfirm } from "@/hooks/use-confirm";

export default function RoleList() {
  const { openModal } = useModal();
  const confirm = useConfirm();

  const [roles, setRoles] = React.useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = React.useState<Role | undefined>(
    roles[0]
  );

  const handleEditRole = async (role: Role) => {
    openModal(RoleCreate, { role }, { size: "xl" }, (result) => {
      console.log("Role created", result);
    });
  };

  const onDelete = async () => {
    await confirm({
      title: "Delete Role",
      description: `Are you sure you want to delete ${selectedRole?.name}? This action cannot be undone.`,
      variant: "destructive",
      confirmText: "Delete",
      onConfirm: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // TODO: Implement API call to delete role
        setRoles((prevRoles) =>
          prevRoles.filter((role) => role.id !== selectedRole?.id)
        );
        setSelectedRole(roles[0]);
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>
            Select a role to view its permissions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={cn(
                "cursor-pointer rounded-md border p-4 transition-colors",
                selectedRole?.id === role.id
                  ? "border-primary bg-muted/20"
                  : "hover:bg-muted/20"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{role.name}</h3>
                {role.id !== "super-admin" && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7 cursor-pointer"
                      onClick={() => handleEditRole(role)}
                    >
                      <Edit className="size-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7 cursor-pointer text-destructive hover:text-destructive"
                      onClick={() => onDelete()}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {role.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Permissions for {selectedRole?.name}</CardTitle>
          <CardDescription>Assigned permissions to this role.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {permissions.map((group) => (
            <Card key={group.id} className="overflow-hidden p-0 gap-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 bg-muted/50">
                <CardTitle className="text-sm font-medium">
                  {group.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  {group.permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex flex-row items-center justify-between space-y-0 rounded-md border bg-card p-2.5"
                    >
                      <div className="flex-1 space-y-0">
                        <Label
                          htmlFor={permission.id}
                          className="text-sm font-medium"
                        >
                          {permission.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                      <Switch
                        id={permission.id}
                        checked={selectedRole?.permissions.includes(
                          permission.id
                        )}
                        disabled
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
