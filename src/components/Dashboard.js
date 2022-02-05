import { Sidebar } from './Sidebar';
import { Board } from './Board';
import { useEffect } from 'react';
import { useData } from './contexts/DataContext';
import { useLocation } from 'react-router-dom';

export function Dashboard() {

    const dataContext = useData();
    const { state } = useLocation();

    useEffect(() => {
      dataContext.populateBoardList();
    }, [])

    return(
        <>
        <Sidebar/>
        {(state !== null) ? <Board location={state}/> : null}
        </>
    )
}