import { Sidebar } from './Sidebar';
import { Board } from './Board';
import { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { subscribeToBoardList } from '../firebase/subscriptions';
import { BoardHeader } from './BoardHeader';
import { populate } from './slices/localStorageSlice';

export function Dashboard() {

    const { pathname, state } = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
    
    dispatch(populate(localStorage.getItem("deleted-items")))

    }, [])

    return(
        <Fragment>
        <Sidebar/>
        <div className='h-100 board'>
          <BoardHeader id={pathname.split("/")[1]}/>
          <Outlet/>
        </div>
        
        </Fragment>
    )
}