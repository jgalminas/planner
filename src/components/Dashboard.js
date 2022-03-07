import { Sidebar } from './Sidebar';
import { Board } from './Board';
import { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { subscribeToBoardList } from '../firebase/subscriptions';

export function Dashboard() {

    const { state } = useLocation();
    const { uid } = useAuth().currentUser;
    const dispatch = useDispatch();

    useEffect(() => {

      subscribeToBoardList(uid, dispatch);

    }, [])

    return(
        <Fragment>
        <Sidebar/>
        {(state !== null) ? <Board location={state}/> : null}
        </Fragment>
    )
}