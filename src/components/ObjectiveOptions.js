import { useState, useRef } from 'react';
import useClickOutside from './hooks/ClickOutside';

/**
    * Options Dropdown component for the objective card
    * Pass React Icon Component or any other component to use it as the icon for the button
    * eg. <OptionsDropdown icon={<OptionsIcon/>}/>
    * Pass an array of objects which contain the name and click function of each option
    * eg. [{name: Rename, click: () => renameObjective(params))}, {name: Delete, click: () => deleteObjective(params))}]
    * 
    * @param icon icon component for the button
    * @param options array of objects each one containing a name and click function for the option
    * @param isOpen a callback function for getting the visibility state of the menu
    * @param setHover a callback function for setting the Hover state to false

*/

export function ObjectiveOptions({ icon, options, isOpen, setHover }) {

    const [visible, setVisible] = useState(false);
    const menu = useRef();
    const button = useRef();

    useClickOutside(button, menu, () => { setVisible(false); isOpen && isOpen(false); setHover && setHover(false) });

    function handleClick(optionClick) {
        optionClick();
        isOpen && isOpen(false);
        setVisible(false);
    }

    return (
        <div className='flex relative'>
            <button ref={button} className="icon-button pointer soft-shadow" onClick={(e) => {e.stopPropagation(); setVisible(!visible); isOpen && isOpen(!visible)} }>
            {icon}
            </button>
        {(visible) ? <div ref={menu} className='flex col no-wrap w-fit h-fit absolute dropdown-options soft-shadow'>
            {(options) ? options.map((option, key) => {
                return <button key={key} className='dropdown-item m-0' onClick={(e) => {e.stopPropagation(); handleClick(option.click)}}> {option.name} </button>
            }) : null}
        </div> : null}
        </div>
    );
}
