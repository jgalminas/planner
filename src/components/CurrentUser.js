import { Fragment } from 'react';
import { useAuth } from './contexts/AuthContext';

/**
* Component which displays the currently signed in user
*/
export function CurrentUser() {

  const authContext = useAuth();
  const user =  authContext.currentUser?.name;

    return (
      <div className='current-user'>
        {user && <Fragment>
          <div className='current-user__icon'>
            <p className='current-user__icon__char'> {user[0].toUpperCase()} </p>
          </div>
          <p className="current-user__name"> {user} </p>
        </Fragment>}
      </div>
    )
  }