import { useState, useRef } from "react";
import useClickOutside from "./hooks/ClickOutside";
import { ReactComponent as Arrow } from './icons/arrow-down.svg'
import { ReactComponent as Check } from './icons/check.svg'

// Custom re-useable select component, takes 3 props:
// * value : the initial value that will be displayed.
// * options : the array of objects containing value and label for each option
// * onChange : function that will be executed when option is selected

export default function Select({value, label, options, onChange}) {

  const controlRef = useRef();
  const menuRef = useRef();
  const [open, setOpen] = useState(false);

  useClickOutside(controlRef, menuRef, () => setOpen(false))

  return (
    <div className='select' ref={controlRef} onClick={(e) => {e.stopPropagation(); setOpen(!open);}}>
      
      <div tabIndex="1" className={`select__control ${open && '--active'}`}>
       {(!label) ? value : label} <Arrow/>
      </div>

      {open &&
      <div className="select__menu" ref={menuRef}> 
        {options.map((option, key) => {
            return <div className='select__menu__option' key={option.value + key} onClick={() => onChange(option)}>
                  {option.value === value && <Check/> } {option.label} </div>
        })}
      </div>
      }
    </div>
  )
}
