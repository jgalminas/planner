import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as AddIcon } from './icons/add.svg';
import { ReactComponent as CheckIcon } from './icons/check.svg'
import { useAuth } from './contexts/AuthContext';

import { useDispatch, useSelector } from 'react-redux';
import { createBoard } from './slices/currentBoardSlice';
import { CurrentUser } from './CurrentUser';
import { subscribeToBoardList } from '../firebase/subscriptions';

export function Sidebar() {

  const authContext = useAuth();
  const boardList = useSelector((state) => state.boardList.value);
  

  const { uid } = useAuth().currentUser;
  const dispatch = useDispatch();

  useEffect(() => {
    subscribeToBoardList(uid, dispatch);
  }, [])



  return (
    <aside className='sidebar flex col no-wrap'>
      <CurrentUser/>
      <button className='sign-out-button' onClick={() => authContext.logOut()}> Sign Out </button>

      <div className='placeholder'></div>
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

  function submit(e) {
    e.preventDefault();
    
    if (name.trim() !== '' && name.trim().length > 3) {
      dispatch(createBoard({name: name, uid: authContext.currentUser.uid}));
      input.current.value = '';
    }

  }

  return (
    <div className="board-list flex col">
      <p className='title'> BOARDS </p>

      <form className='input flex row' onSubmit={(e) => submit(e)}>
      <input ref={input} text={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='enter board name'/>
      <button type="submit"> <CheckIcon/> </button>
      </form>

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