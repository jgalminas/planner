import { useState, useRef } from 'react';
import useClickOutside from './hooks/ClickOutside';
import { Menu } from './Menu.js';

/**
    * Re-usable options dropdown component
    * Pass React Icon Component or any other component to use it as the icon for the button
    * eg. <OptionsDropdown icon={<OptionsIcon/>}/>
    * Pass an array of objects which contain the name and click function of each option
    * eg. [{name: Rename, click: () => renameObjective(params))}, {name: Delete, click: () => deleteObjective(params))}]
    * 
    * @param icon icon component for the button
    * @param options array of objects each one containing a name and click function for the option
*/

export function OptionsDropdown({ icon, options }) {

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
            <button ref={button} className="icon-button pointer" onClick={(e) => {e.stopPropagation(); setVisible(!visible);} }>
            {icon}
            </button>

        {/* {visible &&
            <Menu position='bottom' parentRef={button} close={setVisible(false)}>
            asdddd
            </Menu>} */}
        
        {(visible) ? <div ref={menu} className='flex col no-wrap w-fit h-fit absolute dropdown-options soft-shadow'>
            {(options) ? options.map((option, key) => {
                return <button key={key} className='dropdown-item m-0' onClick={(e) => {e.stopPropagation(); handleClick(option.click)}}> {option.name} </button>
            }) : null}
        </div> : null}
        </div>
    );
}
