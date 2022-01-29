import { useState } from "react";

export function DatePicker(props) {
    
    const [date, setDate] = useState(props.label);
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
            <button onClick={showCalendar}> {date} </button>
            {(visible) ?
            <div>
                
            </div>
            : null}
        </div>
    )
}