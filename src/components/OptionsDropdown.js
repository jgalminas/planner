import { useRef, Fragment } from 'react';
import useClickOutside from './hooks/ClickOutside';
import { Menu } from './Menu.js';

/**
    * A re-usable options dropdown component     
    * @param button button ref which opens the options
    * @param icon icon component for the button
    * @param options array of objects each one containing a name, icon component, type and click function for the option
    * example: { name: 'Delete', icon: <TrashIcon/>, type: 'warning', click: (e) => doSomething(e)}
    * @param visible options state
    * @param setVisible changing options state
    * 
*/

export function OptionsDropdown({ button, options, visible, setVisible }) {

    const menu = useRef();

    useClickOutside(button, menu, () => setVisible(false));

    function handleClick(optionClick) {
        optionClick();
        setVisible(false);
    }

    return (
        <Fragment>
        {visible &&
            <Menu position='bottom-left' parentRef={button} close={() => setVisible(false)}>
                <div className='options-menu'>
                {options && options.map((option, key) => {
                    return <button className={`options-menu__item --${option.type}`} key={key} onClick={(e) => {e.stopPropagation(); handleClick(option.click)}}>
                            { option?.icon }
                            { option.name }
                           </button>
                })}
                </div>
            </Menu>
        }
        </Fragment>
    );
}
