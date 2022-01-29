import { useState, useEffect } from "react";

export function DatePicker(props) {
    
    const [date, setDate] = useState();
    const [visible, setVisible] = useState(false);

    function showCalendar() {
        if (visible) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    }

    return(
        <div className="p-10">
            <button className="pointer" onClick={showCalendar}> {(date) ? date : props.label} </button>
            {(visible) ?
            <div className="flex col no-wrap w-fit h-fit modal">
                asd
                ads
            </div>
            : null}
        </div>
    )
}