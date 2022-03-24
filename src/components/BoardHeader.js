import { OptionsDropdown } from './OptionsDropdown';
import { ReactComponent as Dropdown } from './icons/dropdown.svg';
import { ReactComponent as Check} from './icons/check.svg';
import { ReactComponent as Close} from './icons/close.svg';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renameBoard, deleteBoard } from './slices/currentBoardSlice';
import { subscribeToCurrentBoard } from '../firebase/subscriptions';
import { useNavigate, NavLink } from 'react-router-dom';

export function BoardHeader({ id }) {

    const board = useSelector((state) => state.boardList.value.find((board) => board.id === id));

    const dispatch = useDispatch();
    const [renameInput, setRenameInput] = useState(false);
    const [input, setInput] = useState(board?.name);
    const navigate = useNavigate();

    useEffect(() => {

        if (board) {
            subscribeToCurrentBoard(board.name, board.data, board.id, navigate, dispatch);
        }
        
    }, [board?.id])
  
    useEffect(() => {
      setInput(board?.name);
    }, [board?.name])
  
    const options = [
      {name: "Rename", click: () => {setRenameInput(!renameInput); setInput(board.name);}},
      {name: "Delete", click: () => dispatch((deleteBoard()))}
    ];
  
    return(
      <div className='flex row board-header w-100'>
        {renameInput ? 
        <div className='rename-container flex'>
          <input autoFocus className='rename-input' value={input} onChange={(e) => setInput(e.target.value)} type="text"/>
          <button onClick={() => {dispatch((renameBoard({name: input}))); setRenameInput(false);}} className='icon-button pointer'> <Check/> </button>
          <button onClick={() => setRenameInput(false)} className='icon-button pointer'> <Close/> </button>
        </div>
        : <Fragment>

           <span className='board-title text-overflow'> {input} </span>

          <OptionsDropdown icon={<Dropdown width="18" height="18"/>} options={options} />
          </Fragment>}

          <div className='header-menu flex'>
            <NavLink className={({ isActive }) => (isActive ? "current" : "")} to="board"> Board </NavLink>
            <NavLink className={({ isActive }) => (isActive ? "current" : "")} to="deleted-items"> Deleted Items </NavLink>
          </div>

      </div>
    )
  }