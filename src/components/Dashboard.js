import { Sidebar } from './Sidebar';
import { Board } from './Board';
import { Fragment, useEffect } from 'react';
import { useData } from './contexts/DataContext';
import { useLocation } from 'react-router-dom';

export function Dashboard() {

    const dataContext = useData();
    const { state } = useLocation();

    useEffect(() => {
      dataContext.populateBoardList();
    }, [])

    return(
        <Fragment>
        <Sidebar/>
        {(state !== null) ? <Board location={state}/> : null}
        </Fragment>
    )
}