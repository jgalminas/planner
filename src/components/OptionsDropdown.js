import React, { useState, useRef, useEffect } from 'react';
import { ReactComponent as OptionsIcon } from './icons/options_v.svg'

// Props: show (boolean), options (object containing name of option and onClick function) 

export function OptionsDropdown(props) {

    const [visible, setVisible] = useState(false);
    const menu = useRef();

    function useClickOutside() {
        useEffect(() => {
            function handleClick(e) {
                if (menu.current && !menu.current.contains(e.target)) {
                    setVisible(false);
                }
            }

            document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        }

        }, [menu])
    }

    useClickOutside();

    function showOptions() {

        if (visible) {
            setVisible(false);
        } else {
            setVisible(true);
        }

    }

    return (
        <div >
            <button className="objective-options-button icon-button p-0" onClick={showOptions}>
            <OptionsIcon/>
            </button>
        {(visible) ? <div ref={menu} className='flex col no-wrap w-fit h-fit objective-options'>
            {props.children}
        </div> : null}
        </div>
    );
}