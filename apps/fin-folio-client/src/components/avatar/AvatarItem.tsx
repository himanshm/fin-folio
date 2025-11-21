import type { UserAvatarItem } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "../ui/dropdown-menu";

const renderMenuItemContent = ({
  icon: Icon,
  label
}: {
  icon: LucideIcon;
  label: string;
}) => (
  <>
    <Icon className="h-4 w-4" />
    {label}
  </>
);

const AvatarItem = ({ item }: { item: UserAvatarItem }) => {
  if (item.subMenuItems) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          {renderMenuItemContent({ icon: item.icon, label: item.label })}
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent sideOffset={8} alignOffset={15}>
            {item.subMenuItems.map(submenuItem => (
              <DropdownMenuItem
                key={submenuItem.label}
                onClick={submenuItem.onClick}
              >
                {renderMenuItemContent({
                  icon: submenuItem.icon,
                  label: submenuItem.label
                })}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
  }

  return (
    <DropdownMenuItem key={item.label} onClick={item.onClick}>
      {renderMenuItemContent({ icon: item.icon, label: item.label })}
    </DropdownMenuItem>
  );
};

export default AvatarItem;
