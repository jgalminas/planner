import { useAuth } from './contexts/AuthContext';

/**
* Component which displays the currently signed in user
*/
export function CurrentUser() {

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