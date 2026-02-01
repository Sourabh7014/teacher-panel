export interface Role {
  id: string;
  name: string;
  description: string;
  display_name: string;
  status: string;
  permissions: Permission[];
  created_at: number;
}

export interface Permission {
  id: string;
  name: string;
  display_name: string;
}
