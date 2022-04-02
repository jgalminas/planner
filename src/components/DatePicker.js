import { Component  } from 'react';
import { ReactComponent as ChevronLeft } from './icons/chevron-left.svg';
import { ReactComponent as ChevronRight } from './icons/chevron-right.svg';
import ReactDatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";

/**
 * Re-usable datepicker component
 * 
 * @param {value} value date value as string
 * @param {onChange} onChange callback function to update the state
 */
export function DatePicker({value, onChange}) {

  return (
    <ReactDatePicker openToDate={(value !== '') ? new Date(value) : null} customInput={<Input date={value}/>} onChange={(e) => onChange(e.toISOString())} renderCustomHeader={Header}
     calendarClassName='date-picker' showPopperArrow={false}>
    <div className='flex row gap-15 time-section'>
    <button className='clear-button' onClick={() => onChange("")}> Clear </button>
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
      {(date === '') ? 'Pick a date' :  new Date(date).toLocaleDateString()}
    </button>
    )
  }
}