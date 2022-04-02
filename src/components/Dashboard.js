import { Sidebar } from './Sidebar';
import { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { BoardHeader } from './BoardHeader';
import { populate } from './slices/localStorageSlice';

/**
 * Dashboard component which renders the sidebar, board header and content pages. 
 * 
 */
export function Dashboard() {

    const { pathname } = useLocation();
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