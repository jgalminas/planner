import { ReactComponent as Settings } from './icons/settings.svg';
import { useAuth } from './contexts/AuthContext';

export function CurrentUser(props) {

  const authContext = useAuth();

    return (
      <div className='current-user'>
        <div className='icon'>
            <p className='char'> J </p>
        </div>
        <p className="name"> Justas Galminas </p>
      </div>
    )
  }