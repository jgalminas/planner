import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as AddIcon } from './icons/add.svg';
import { ReactComponent as CheckIcon } from './icons/check.svg'
import { useAuth } from './contexts/AuthContext';

import { useDispatch, useSelector } from 'react-redux';
import { createBoard } from './slices/currentBoardSlice';
import { CurrentUser } from './CurrentUser';

import "react-datepicker/dist/react-datepicker.css";
import Select from './Select';


export function Sidebar() {

  const authContext = useAuth();
  const boardList = useSelector((state) => state.boardList.value);


  const [select, setSelect] = useState("Select a value");
  const options = [
    {value: 0, label: 'Option 1'},
    {value: 1, label: 'Option 2'},
    {value: 2, label: 'Option 3'}
  ]



  return (
    <aside className='sidebar flex col no-wrap'>
      <CurrentUser/>

      <Select value={select} options={options} onChange={(e) => setSelect(e.label)}/>

      <div className='placeholder'></div>
      {/* <button onClick={() => authContext.logOut()}> sign out </button> */}
      <hr/>

      <BoardList boardList={boardList}/>

    </aside>
  );
}

function BoardList(props) {

  const authContext = useAuth();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const input = useRef();

  return (
    <div className="board-list flex col">
      <p className='title'> BOARDS </p>
      <div className='input flex row'>
      <input ref={input} text={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='enter board name'/>
      <button onClick={() => {
        dispatch(createBoard({name: name, uid: authContext.currentUser.uid}));
        input.current.value = '';
        }}> <CheckIcon fill="#767AB5"/> </button>
      </div>
      <div>
        {props.boardList && props.boardList.map((item) => {
          return <BoardItem key={item.id} data={item}/>
        })}
      </div>
    </div>
  );
}

function BoardItem(props) {

  return (
    <Link state={{name: props.data.name, boardId: props.data.id, dataId: props.data.data}} to={`/${props.data.id}`}>
      <p className='board-item'> {props.data.name} </p>
    </Link>
  );
}