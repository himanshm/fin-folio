import type { LucideIcon } from "lucide-react";

export interface UserAvatarItem {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  subMenuItems?: UserAvatarItem[];
}
