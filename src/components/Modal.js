import { createPortal } from "react-dom";
import { ReactComponent as CloseIcon} from './icons/close.svg';
import { useRef } from "react";
import useClickOutside from "./hooks/ClickOutside";


export function Modal({close, children}) {

    const modal = useRef();

    useClickOutside(null, modal, () => close());

    return (
        createPortal(
        <div className="modal-background">
            <div ref={modal} className="modal-contents">
                {children}
                <button className="absolute exit-button p-0 pointer" onClick={() => close()}> <CloseIcon/> </button>
            </div>
        </div>
        ,document.getElementById('root'))
    )
}