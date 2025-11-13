import { useAuth } from "@/hooks/useAuth";
import type { UserAvatarItem } from "@/types";
import {
  LockKeyhole,
  LogOut,
  MonitorCog,
  Settings,
  UserCog
} from "lucide-react";
import { useNavigate } from "react-router";
import AvatarItem from "./AvatarItem";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";

const UserAvatar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const userAvatarItems: UserAvatarItem[] = [
    {
      label: "Settings",
      icon: Settings,
      subMenuItems: [
        {
          label: "Profile",
          icon: UserCog,
          onClick: () => navigate("/profile")
        },
        {
          label: "Preferences",
          icon: MonitorCog,
          onClick: () => navigate("/preferences")
        },
        {
          label: "Change Password",
          icon: LockKeyhole,
          onClick: () => navigate("/update-password")
        }
      ]
    },
    {
      label: "Logout",
      icon: LogOut,
      onClick: () => signOut()
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full p-0 cursor-pointer"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {userAvatarItems.map(item => (
          <AvatarItem key={item.label} item={item} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
