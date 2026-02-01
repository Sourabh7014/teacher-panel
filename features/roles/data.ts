export type Permission = {
  id: string;
  name: string;
  description: string;
};

export type PermissionGroup = {
  id: string;
  name: string;
  permissions: Permission[];
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

export const permissions: PermissionGroup[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    permissions: [
      {
        id: "dashboard:view",
        name: "View Dashboard",
        description: "Can view the main dashboard.",
      },
    ],
  },
  {
    id: "users",
    name: "Users",
    permissions: [
      {
        id: "users:view",
        name: "View Users",
        description: "Can view the list of users.",
      },
      {
        id: "users:create",
        name: "Create Users",
        description: "Can create new users.",
      },
      {
        id: "users:edit",
        name: "Edit Users",
        description: "Can edit existing users.",
      },
      {
        id: "users:delete",
        name: "Delete Users",
        description: "Can delete users.",
      },
    ],
  },
  {
    id: "roles",
    name: "Roles",
    permissions: [
      {
        id: "roles:view",
        name: "View Roles",
        description: "Can view roles and their permissions.",
      },
      {
        id: "roles:create",
        name: "Create Roles",
        description: "Can create new roles.",
      },
      {
        id: "roles:edit",
        name: "Edit Roles",
        description: "Can edit existing roles.",
      },
      {
        id: "roles:delete",
        name: "Delete Roles",
        description: "Can delete roles.",
      },
    ],
  },
];

export const roles: Role[] = [
  {
    id: "super-admin",
    name: "Super Admin",
    description: "Has all permissions.",
    permissions: permissions.flatMap((g) => g.permissions.map((p) => p.id)),
  },
  {
    id: "admin",
    name: "Admin",
    description: "Has most permissions, except for managing roles.",
    permissions: [
      "dashboard:view",
      "users:view",
      "users:create",
      "users:edit",
      "users:delete",
    ],
  },
  {
    id: "editor",
    name: "Editor",
    description: "Can only view users and dashboard.",
    permissions: ["dashboard:view", "users:view"],
  },
];
