import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { createBoard } from './slices/currentBoardSlice';
import { subscribeToBoardList } from '../firebase/subscriptions';

import { ReactComponent as PlusIcon } from './icons/plus-circle.svg'
import { ReactComponent as ArrowDown } from './icons/arrow-down.svg';
import { ReactComponent as WorkspacesIcon } from './icons/workspaces.svg';
import { ReactComponent as HomeIcon } from './icons/home.svg';
import { ReactComponent as SettingsIcon } from './icons/settings_cog.svg';
import { ReactComponent as LogoutIcon } from './icons/exit.svg';
import { ReactComponent as LogoIcon } from './icons/logo.svg';
import { ReactComponent as MinimiseIcon } from './icons/minimise.svg';

import { Menu } from './Menu';
import { AccountSettings } from './AccountSettings';

export function Sidebar() {

  const authContext = useAuth();
  const boardList = useSelector((state) => state.boardList.value);
  const { uid } = useAuth().currentUser;
  const dispatch = useDispatch();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    subscribeToBoardList(uid, dispatch);
  }, [])

  return (
    <aside className='sidebar'>

      <div className='sidebar__logo-section'>
        <LogoIcon/>
        <button  className='sidebar__logo-section__minimise-button'> <MinimiseIcon/> </button>
      </div>

      <div className='sidebar__navigation-section'>
        <Link className='sidebar__navigation-item' to='/'> <HomeIcon/> Home </Link>
        <Workspaces boardList={boardList}/>
      </div>

      <div className='sidebar__account-section'>
        <button onClick={() => setShowSettings(!showSettings)} className='sidebar__navigation-item'> <SettingsIcon/> Account Settings </button>
        <Link className='sidebar__account-section__logout' onClick={authContext.logOut} to='/'> <LogoutIcon/> Log Out </Link>
      </div>
      
      {showSettings && <AccountSettings close={setShowSettings}/>}

    </aside>
  );
}

function Workspaces(props) {

  const authContext = useAuth();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [showWorkspaces, setShowWorkspaces] = useState(true);
  const [isOpen, setOpen] = useState(false);

  const addWorkspaceRef = useRef();
  const input = useRef();


  function submit(e) {
    e.preventDefault();
    
    if (name.trim() !== '' && name.trim().length > 3) {
      dispatch(createBoard({name: name, uid: authContext.currentUser.uid}));
      setOpen(false);
    }

  }

  return (
      <div id='workspaces' className='workspaces'>

        <button  ref={addWorkspaceRef} className='workspaces__new-button' onClick={() => setOpen(!isOpen)}> <PlusIcon/> Add Workspace </button>
        
        {isOpen &&
          <Menu position='right' parentRef={addWorkspaceRef} close={() => setOpen(false)}>
            <form className='new-workspace-form' onSubmit={(e) => submit(e)} autoComplete="off">
            <label className='new-workspace-form__label' htmlFor='input'> Workspace name </label>
            <input autoFocus className='new-workspace-form__input' minLength={4} id='input' ref={input} text={name} onChange={(e) => setName(e.target.value)} type="text"/>
            <button className='new-workspace-form__button' type="submit"> <PlusIcon/> Add </button>
            </form>
          </Menu>
        }

        <button className='workspaces__show-button' onClick={() => setShowWorkspaces(!showWorkspaces)}>
          <span className='workspaces__show-button__span'><WorkspacesIcon/> Workspaces</span>
          <ArrowDown className={`workspaces__show-button__arrow${(showWorkspaces && '--up')}`}/>
        </button>
          
          {showWorkspaces &&
            <ul className='workspaces__list'>
              {props.boardList && props.boardList.map((item) => {
                return <WorkspaceItem key={item.id} data={item}/>
              })}
            </ul>
          }

      </div>
  );
}

function WorkspaceItem(props) {

  return (
      <li className='workspaces__list__item'>
        <Link className='workspaces__list__item__link' state={{name: props.data.name, boardId: props.data.id, dataId: props.data.data}} to={`/${props.data.id}`}>
          <div className='workspaces__list__item__point'></div>
          <p className='workspaces__list__item__text'> {props.data.name} </p>
        </Link>
      </li>
  );
}