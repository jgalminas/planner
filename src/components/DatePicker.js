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
      
    <button className='date-picker__clear-button' onClick={() => onChange("")}> Clear </button>

    </ReactDatePicker>
  );
}

function Header({ date, decreaseMonth, increaseMonth }) {

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

  return (
    <div className='date-picker__header'>
      <button className='date-picker__header__change-month-button' onClick={decreaseMonth}> <ChevronLeft/> </button>
      <p className='date-picker__header__current-month-label'> {`${months[date.getMonth()]} ${date.getYear() + 1900}`} </p>
      <button className='date-picker__header__change-month-button' onClick={increaseMonth}> <ChevronRight/> </button>
    </div>
  );
}

// class compoment has to be used in order to pass ref
class Input extends Component {
  render() {

    const { date, onClick } = this.props;

    return (
      <button className="datepicker-input" onClick={(e) => {e.preventDefault(); onClick(e)}} >
      {(date === '') ? 'Pick a date' :  new Date(date).toLocaleDateString()}
      </button>
    )
  }
}