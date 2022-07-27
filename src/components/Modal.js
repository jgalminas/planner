import { Fragment } from "react";
import { createPortal } from "react-dom";
import { ReactComponent as CloseIcon} from './icons/close.svg';

export function Modal({ close, children }) {



    return (
        createPortal(
        <div className="modal-background">
            <div className='modal-contents'>
                {children}
                <button className='modal-exit-button' onClick={() => close()}> <CloseIcon/> </button>
            </div>
        </div>
        , document.getElementById('root'))
    )
}