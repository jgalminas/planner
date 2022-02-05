import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as AddIcon } from './icons/add.svg';
import { useAuth } from './contexts/AuthContext';

import { useGlobalState } from 'state-pool';
import { useData } from './contexts/DataContext';

export function Sidebar() {

  const authContext = useAuth();
  const [showInput, setShowInput] = useState(false);

  const [boardList] = useGlobalState("boardList");

  return (
    <aside className="sidebar">
      <div>
        <p className='white p-10'> Logged in as: {authContext.currentUser.email} </p>
        <button onClick={authContext.logOut} className='p-10 options-button white pointer'> Log Out </button>
      </div>
      <BoardOptions showInput={() => setShowInput(!showInput)}/>
      {showInput ? <NewBoardInput/> : null}
      <BoardList boardList={boardList}/>
    </aside>
  );
}

function BoardOptions(props) {
  return (
    <div className="flex row no-wrap w-100 p-10">
      <h1 className="md-title white w-fit m-0">Your Boards</h1>
      <button className="w-fit" onClick={props.showInput}>
        <AddIcon stroke="#ffffff" />
      </button>
    </div>
  );
}

function BoardList(props) {

  return (
    <div className="flex col">
      {props.boardList.map((item) => {
        return <BoardItem key={item.id} data={item}/>
      })}
    </div>
  );
}

function BoardItem(props) {

  return (
    <Link className="flex row board-item" state={{name: props.data.name, boardId: props.data.id, dataId: props.data.data}} to={`/${props.data.id}`}>
      <div className="board-item-icon">
        {props.data.name.charAt(0).toUpperCase()}
      </div>
      <div className="align-center white light text-overflow"> {props.data.name} </div>
    </Link>
  );
}

export function NewBoardInput() {

  const [name, setName] = useState("");
  const dataContext = useData();

  return (
    <div className="flex col no-wrap p-10 gap-15">
      <input className="h-fit new-board-input w-auto" type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}></input>
      <button className="new-board-button white w-100" autoFocus onClick={() => dataContext.createBoard(name)}>
        Create Board
      </button>
    </div>
  );
}
