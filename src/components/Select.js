import { useState, useRef } from "react";
import useClickOutside from "./hooks/ClickOutside";
import { ReactComponent as Arrow } from './icons/dropdown.svg'


// Custom re-useable select component, takes 3 props:
// * value : the initial value that will be displayed.
// * options : the array of objects containing value and label for each option
// * onChange : function that will be executed when option is selected

export default function Select({value, options, onChange}) {

  const controlRef = useRef();
  const menuRef = useRef();
  const [open, setOpen] = useState(false);

  useClickOutside(controlRef, menuRef, () => setOpen(false))

  return (
    <div className="select-wrapper" ref={controlRef} onClick={(e) => {e.stopPropagation(); setOpen(!open);}}>
      
      <div tabIndex="1" className="select-control"> {value} <Arrow width="11" height="11"/> </div>


      {open &&
      <div className="select-menu" ref={menuRef}> 
        {options.map((option, key) => {
            return <div className="select-option" key={option.value + key} onClick={() => onChange(option)}> {option.label} </div>
        })}
      </div>
      }
    </div>
  )
}
