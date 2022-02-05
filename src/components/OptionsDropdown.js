import React, { useState, useRef} from 'react';
import useClickOutside from './hooks/ClickOutside';

// Re-usable options dropdown component
// Pass React Icon Component or any other component to use it as the icon for the button
// eg. <OptionsDropdown icon={<OptionsIcon/>}/>
// Pass an array of objects which contain the name and click function of each option
// eg. [{name: Rename, click: () => renameObjective(params))}, {name: Delete, click: () => deleteObjective(params))}]

export function OptionsDropdown(props) {

    const [visible, setVisible] = useState(false);
    const menu = useRef();
    const button = useRef();

    useClickOutside(button, menu, () => setVisible(false));

    function handleClick(optionClick) {
        optionClick();
        setVisible(false);
    }

    return (
        <div className='flex relative'>
            <button ref={button} className="icon-button p-5 pointer" onClick={(e) => {e.stopPropagation(); setVisible(!visible)} }>
            {props.icon}
            </button>
        {(visible) ? <div ref={menu} className='flex col no-wrap w-fit h-fit absolute objective-options'>
            {(props.options) ? props.options.map((option, key) => {
                return <button key={key} className='category-options-item m-0' onClick={(e) => {e.stopPropagation(); handleClick(option.click)}}> {option.name} </button>
            }) : null}
        </div> : null}
        </div>
    );
}
