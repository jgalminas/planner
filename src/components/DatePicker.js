import { useState, useEffect, forwardRef } from 'react';
import { ReactComponent as ChevronLeft } from './icons/chevron-left.svg';
import { ReactComponent as ChevronRight } from './icons/chevron-right.svg';
import ReactDatePicker from 'react-datepicker';

export function DatePicker(props) {

  const [date, setDate] = useState(null);

  const Input = forwardRef(({ onClick }, ref) => (
    <button className="datepicker-input" onClick={onClick} ref={ref}>
      {(!date) ? 'Pick a date' : date}
    </button>))


  return (
    <ReactDatePicker customInput={<Input/>} onChange={(e) => setDate(e.toLocaleDateString("en-UK"))} renderCustomHeader={Header}
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