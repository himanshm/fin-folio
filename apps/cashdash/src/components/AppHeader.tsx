import { Link } from 'react-router';
import UserAvatar from './UserAvatar';

const AppHeader = () => {
  return (
    <header>
      <Link to="/" className="text-2xl font-bold">
        Finance Folio
      </Link>
      <UserAvatar />
    </header>
  );
};

export default AppHeader;
