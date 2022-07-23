import { OptionsDropdown } from './OptionsDropdown';
import { ReactComponent as Dropdown } from './icons/dropdown.svg';
import { ReactComponent as Check} from './icons/check-circle.svg';
import { ReactComponent as Close} from './icons/close.svg';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renameBoard, deleteBoard } from './slices/currentBoardSlice';
import { subscribeToCurrentBoard } from '../firebase/subscriptions';
import { useNavigate } from 'react-router-dom';
import { NavigationLink } from '../components/NavigationLink.js';
import { ReactComponent as EditIcon } from './icons/edit.svg';
import { ReactComponent as TrashIcon } from './icons/trash.svg';
import { CurrentUser } from '../components/CurrentUser.js';

export function BoardHeader({ id }) {

    const board = useSelector((state) => state.boardList.value.find((board) => board.id === id));
    const dispatch = useDispatch();

    // state for toggling rename input and holding its value
    const [renameInput, setRenameInput] = useState(false);
    const [input, setInput] = useState(board?.name);

    const button = useRef();
    const [showOptions, setShowOptions] = useState(false);

    const navigate = useNavigate();
    
    // subscribing to boardData document from Firebase when the board header is rendered
    useEffect(() => {

        if (board) {
            subscribeToCurrentBoard(board.name, board.data, board.id, navigate, dispatch);
        }
        
    }, [board?.id])
    
    // setting rename input to current board name when its rendered
    useEffect(() => {
      setInput(board?.name);
    }, [board?.name])

    // options for the options drop down menu
    const options = [
      {name: "Rename", icon: <EditIcon/>, type: 'regular', click: () => {setRenameInput(!renameInput); setInput(board.name);}},
      {name: "Delete", icon: <TrashIcon/>, type: 'warning', click: () => dispatch((deleteBoard()))}
    ];
  
    return(
      <div className='board-header'>
        {renameInput ? 
        <div className='rename-container'>
          <input autoFocus className='rename-container__input' value={input} onChange={(e) => setInput(e.target.value)} type="text"/>
          <div className='rename-container__button-wrapper'>
          <button onClick={() => {dispatch((renameBoard({name: input}))); setRenameInput(false);}} className='rename-container__button-wrapper__button'> <Check/> </button>
          <button onClick={() => setRenameInput(false)} className='rename-container__button-wrapper__button'> <Close/> </button>
          </div>
        </div>
        :

            <div className='board-header__row'>
            <p className='board-header__title'> {input} </p>
            <button ref={button} onClick={() => setShowOptions(!showOptions)} className="board-header__options-button"> <Dropdown/> </button>
            <OptionsDropdown button={button} options={options} visible={showOptions} setVisible={setShowOptions}/>
            </div> 
        }
          <div className='board-header__row'>
            <HeaderNavigation/>
            <div className='board-header__row__current-user-wrapper'>
              <CurrentUser/>
            </div>
          </div>

      </div>
    )
  }

  function HeaderNavigation() {
    return (
      <div className='header-navigation'>
        <NavigationLink className='header-navigation__link' activeClassName='--current' to='board' text='Board'/>
        <NavigationLink className='header-navigation__link' activeClassName='--current' to='deleted-items' text='Deleted Items'/>
    </div>
    );
  }