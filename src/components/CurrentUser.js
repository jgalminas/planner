import { ReactComponent as Settings } from './icons/settings.svg';
import { useAuth } from './contexts/AuthContext';

export function CurrentUser(props) {

  const authContext = useAuth();
  const user =  authContext.currentUser.email;

    return (
      <div className='current-user'>
        <div className='icon'>
            <p className='char'> {user[0].toUpperCase()} </p>
        </div>
        <p className="name text-overflow"> {user} </p>
      </div>
    )
  }