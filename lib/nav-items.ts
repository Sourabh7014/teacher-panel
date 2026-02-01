import {
  BookAlert,
  Building2,
  Home,
  LockKeyhole,
  Map,
  MapPin,
  MapPinned,
  Image,
  MessageSquareText,
  MessageSquareWarning,
  // Settings,
  TriangleAlert,
  UserSearch,
  UserStar,
  Users,
  BookText,
  Newspaper,
  BookCopy,
} from "lucide-react";

export const navData = {
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: Home,
        },
      ],
    },
    {
      title: "Users",
      items: [
        {
          title: "Pending Users",
          url: "/users/pending",
          icon: UserSearch,
        },
        {
          title: "Users",
          url: "/users",
          icon: Users,
          // shortcut: "⌘+u",
        },
        {
          title: "Admin Users",
          url: "/users/admins",
          icon: UserStar,
        },
      ],
    },
    {
      title: "Vendors",
      items: [
        {
          title: "Vendors",
          url: "/vendors",
          icon: Building2,
          // shortcut: "⌘+v",
        },
      ],
    },
    {
      title: "Posts ",
      items: [
        {
          title: "Posts",
          url: "/posts",
          icon: Image,
        },
        {
          title: "Reviews",
          url: "/reviews",
          icon: MessageSquareText,
        },
      ],
    },
    {
      title: "Locations",
      items: [
        {
          title: "Countries",
          url: "/countries",
          icon: Map,
        },
        {
          title: "Sub Country Division",
          url: "/states",
          icon: MapPin,
        },
        {
          title: "Cities",
          url: "/cities",
          icon: MapPinned,
        },
      ],
    },
    {
      title: "Reports",
      items: [
        {
          title: "Report Categories",
          url: "/reports/categories",
          icon: BookAlert,
        },
        {
          title: "Reports",
          url: "/reports",
          icon: TriangleAlert,
        },
      ],
    },
    {
      title: "Feedbacks",
      items: [
        {
          title: "Feedback Categories",
          url: "/feedbacks/categories",
          icon: MessageSquareText,
        },
        {
          title: "Feedbacks",
          url: "/feedbacks",
          icon: MessageSquareWarning,
        },
      ],
    },
    {
      title: "Blogs",
      items: [
        {
          title: "Categories",
          url: "/blogs/categories",
          icon: BookCopy,
        },
        {
          title: "Articles",
          url: "/blogs/articles",
          icon: Newspaper,
        },
      ],
    },
    {
      title: "App Management",
      items: [
        {
          title: "OTPs",
          url: "/otps",
          icon: LockKeyhole,
        },
        // {
        //   title: "Settings",
        //   url: "/settings",
        //   icon: Settings,
        // },
      ],
    },
  ],
};
