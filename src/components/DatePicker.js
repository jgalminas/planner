import { useState, useEffect, forwardRef, Component  } from 'react';
import { ReactComponent as ChevronLeft } from './icons/chevron-left.svg';
import { ReactComponent as ChevronRight } from './icons/chevron-right.svg';
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";

export function DatePicker(props) {

  const [date, setDate] = useState(null);

  return (
    <ReactDatePicker customInput={<Input date={date}/>} onChange={(e) => setDate(e.toLocaleDateString("en-UK"))} renderCustomHeader={Header}
     calendarClassName='date-picker' showPopperArrow={false}/>
  );
}

function Header({
  date,
  decreaseMonth,
  increaseMonth,
}) {

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

  return <div className='datepicker-header'>
      <button className='change-month-button' onClick={decreaseMonth}> <ChevronLeft/> </button>
      <p className='current-month'> {months[date.getMonth()]} </p>
      <button className='change-month-button' onClick={increaseMonth}> <ChevronRight/> </button>
  </div>;
}

class Input extends Component {
  render() {

    const { date, onClick } = this.props;

    return (
      <button className="datepicker-input" onClick={onClick} >
      {(!date) ? 'Pick a date' :  `Due ${date}`}
    </button>
    )
  }
}