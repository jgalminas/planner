import { useState, useRef } from "react";
import useClickOutside from "./hooks/ClickOutside";

export default function Select({value, options, onChange}) {

  const controlRef = useRef();
  const menuRef = useRef();
  const [open, setOpen] = useState(false);

  useClickOutside(controlRef, menuRef, () => setOpen(false))

  return (
    <div className="select-wrapper" ref={controlRef} onClick={(e) => {e.stopPropagation(); setOpen(!open);}}>
      
      <div className="select-control"> {value} </div>

      {open &&
      <div className="select-menu" ref={menuRef}> 
        {options.map((option) => {
            return <div className="select-option" key={option.value} onClick={() => onChange(option)}> {option.label} </div>
        })}
      </div>
      }
    </div>
  )
}
