import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/hooks/useUser';

const UserAvatar = () => {
  const { user } = useUser();
  console.log(user);

  if (!user) return null;

  return (
    <Avatar className="size-10">
      <AvatarImage src={user.avatarUrl} alt={user.email} />
      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
