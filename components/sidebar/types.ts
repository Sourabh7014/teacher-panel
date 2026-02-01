interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
  shortcut?: string;
}

type NavLink = BaseNavItem & {
  url: string;
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[];
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

interface NavGroup {
  title: string;
  items: NavItem[];
}

export type { NavGroup, NavItem, NavCollapsible, NavLink, BaseNavItem };
