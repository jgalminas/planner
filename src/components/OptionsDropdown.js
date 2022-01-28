import React, { useState, useRef, useEffect } from 'react';
import { ReactComponent as OptionsIconVertical } from './icons/options_v.svg'
import { ReactComponent as OptionsIconHorizontal } from './icons/options_h.svg'

export function OptionsDropdown(props) {

    const [visible, setVisible] = useState(false);
    const menu = useRef();
    const button = useRef();

    function useClickOutside() {
        useEffect(() => {
            function handleClick(e) {
                if (menu.current && !menu.current.contains(e.target)) {
                    setVisible(false);
                    console.log("menu clicked");
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
        <div>
            <button ref={button} className="objective-options-button icon-button p-0" onClick={showOptions}>
            <OptionsIconVertical/>
            </button>
        {(visible) ? <div ref={menu} className='flex col no-wrap w-fit h-fit objective-options'>
            {props.children}
        </div> : null}
        </div>
    );
}