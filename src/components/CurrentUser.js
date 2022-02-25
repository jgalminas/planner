import { ReactComponent as Settings } from './icons/settings.svg';
import { useAuth } from './contexts/AuthContext';

export function CurrentUser(props) {

  const authContext = useAuth();

    console.log(authContext.currentUser);

    return (
      <div className='current-user'>
        <div className='icon'>
            <p className='char'> P </p>
        </div>
        <p className="name"> John Doe </p>
      </div>
    )
  }