import { Fragment } from 'react';
import { useState, useRef } from 'react';
import { ReactComponent as TrashIcon } from './icons/trash.svg'
import { deleteObjective } from './slices/currentBoardSlice';
import { addItem } from './slices/localStorageSlice';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as OptionsIconV } from './icons/options_v.svg'
import { FloatingMenu } from './FloatingMenu.js';

export function ObjectiveOptions({ data, setOpen, setHover }) {

    const boardId = useSelector((state) => state.currentBoard.value.boardId);
    const dispatch = useDispatch();
    
    const [visible, setVisible] = useState(false);
    const button = useRef();

    const { details, catId } = data;

    const options = [
        {name: "Delete", icon: <TrashIcon/>, type: 'warning', click: () => {
          dispatch(deleteObjective({objId: details.id, catId: catId}));
          dispatch(addItem({boardId: boardId, data: {...details, catId: catId}}))}}
    ];
    
    function handleClick(optionClick) {
        optionClick();
        setOpen(false);
        setVisible(false);
    }

    return (
        <Fragment>

            <button ref={button} className="objective__options-button" onClick={(e) => {e.stopPropagation(); setVisible(!visible); setOpen(!visible)} }>
            <OptionsIconV/>
            </button>
          
            {visible &&
                <FloatingMenu button={button.current} close={() => {setVisible(false); setOpen(false); setHover && setHover(false)}}>
                    <div className='options-menu'>
                        {options && options.map((option, key) => {
                        return <button className={`options-menu__item --${option.type}`} key={key} onClick={(e) => {e.stopPropagation(); handleClick(option.click)}}>
                            { option?.icon }
                            { option.name }
                            </button>
                        })}
                    </div>
                </FloatingMenu>}
                
        </Fragment>
    );
}
