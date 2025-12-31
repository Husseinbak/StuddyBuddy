import {
  BookOpenIcon,
  BrainIcon,
  UploadIcon,
  UsersIcon,
  BarChartIcon,
  TrophyIcon,
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: <BookOpenIcon size={20} />,
  },
  {
    path: "/quiz",
    label: "Quizzes",
    icon: <BrainIcon size={20} />,
  },
  {
    path: "/documents",
    label: "Uploads",
    icon: <UploadIcon size={20} />,
  },
  {
    path: "/tutoring",
    label: "Tutoring",
    icon: <UsersIcon size={20} />,
  },
  {
    path: "/analytics",
    label: "Analytics",
    icon: <BarChartIcon size={20} />,
  },
  {
    path: "/leaderboard",
    label: "Leaderboard",
    icon: <TrophyIcon size={20} />,
  },
];

export default navItems;
