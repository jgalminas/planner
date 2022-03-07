import { useState, useEffect, forwardRef, Component  } from 'react';
import { ReactComponent as ChevronLeft } from './icons/chevron-left.svg';
import { ReactComponent as ChevronRight } from './icons/chevron-right.svg';
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";

export function DatePicker({value, onChange}) {

  return (
    <ReactDatePicker openToDate={value?.date !== '' ? new Date(value?.date) : null} customInput={<Input date={value?.date}/>} onChange={(e) => onChange({...value, date: e.toISOString().split("T")[0]})} renderCustomHeader={Header}
     calendarClassName='date-picker' showPopperArrow={false}>
    <div className='flex row gap-15 time-section'>
    <label className='time-label' htmlFor='time-input'> Time </label>
    <input className='time-input' type="time" name='time-input' value={value?.time} onChange={(e) => onChange({...value, time: e.target.value})}/>
    <button className='clear-button' onClick={() => onChange({date: "", value: ""})}> Clear </button>
    </div>

    </ReactDatePicker>
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
      <p className='current-month'> {`${months[date.getMonth()]} ${date.getYear() + 1900}`} </p>
      <button className='change-month-button' onClick={increaseMonth}> <ChevronRight/> </button>
  </div>;
}

class Input extends Component {
  render() {

    const { date, onClick } = this.props;

    return (
      <button className="datepicker-input" onClick={onClick} >
      {(!date) ? 'Pick a date' :  `Due ${new Date(date).toLocaleDateString()}`}
    </button>
    )
  }
}