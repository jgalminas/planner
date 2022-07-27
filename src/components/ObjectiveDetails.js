import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from './DatePicker';
import Select from './Select';
import { updateObjective, changeCategory } from './slices/currentBoardSlice';
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useClickOutsideExcept } from "./hooks/ClickOutside";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function ObjectiveDetails() {

  const [parent, setParent] =  useState(document.querySelector('.board'));
  const panel = useRef();

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const path = location.pathname.substring(0, location.pathname.indexOf(id));

  const categories = useSelector((state) => state.currentBoard.value.categories);
  const currentCategory = categories.find((cat) => cat.objectives.find((obj) => obj.id === id));
  const data = currentCategory.objectives.find((obj) => obj.id === id);

  const [details, setDetails] = useState(data);
  const [previousDetails, setPreviousDetails] = useState(data);

  const [category, setCategory] = useState({ value: currentCategory.id, label: currentCategory.name });
  const [previousCategory, setPreviousCategory] = useState({ value: currentCategory.id, label: currentCategory.name });
  
  useClickOutsideExcept(panel, 'objective', () => { navigate(path) });

  useEffect(() => {
      setParent(document.querySelector('.board'))
  })

  useEffect(() => {

      updateDetails()

  }, [details.priority, details.dueDate, details.startingDate, details.progress, category])

  // on id change
  useEffect(() => {

    setDetails(data);
    setCategory({ value: currentCategory.id, label: currentCategory.name });

    setPreviousDetails(data);
    setPreviousCategory({ value: currentCategory.id, label: currentCategory.name })

  }, [id])

  // function which validates and changes the dates state
  function setDate(e, type) {

      // date from the datepicker (type determines which one it is)
    const date = new Date(e);

    if (type === "DUE_DATE") {

      const startingDate = new Date(details.startingDate);
      
      if (date == "Invalid Date") {
        setDetails({...details, dueDate: ""})
      } else if (startingDate == "Invalid Date"){
        setDetails({...details, dueDate: e})
      } else if ( date < startingDate) {
        setDetails({...details, startingDate: e, dueDate: e})
      } else if (date >= startingDate) {
        setDetails({...details, dueDate: e})
      }

    } else if (type === "STARTING_DATE") {

      const dueDate = new Date(details.dueDate);
      if (date == "Invalid Date") {
        setDetails({...details, startingDate: ""})
      } else if (dueDate == "Invalid Date"){
        setDetails({...details, startingDate: e})
      } else if (date > dueDate) {
        setDetails({...details, startingDate: e, dueDate: e})
      } else if (date <= dueDate) {
        setDetails({...details, startingDate: e})
      }

    }
  }

  const categoryOptions = categories.map((option) => {
    return {value: option.id, label: option.name}
  })

  const progressOptions = [
    {value: 'Not Started', label: 'Not Started'},
    {value: 'In Progress', label: 'In Progress'},
    {value: 'Completed', label: 'Completed'}
  ]

  const priorityOptions = [
    {value: 'Low', label: 'Low'},
    {value: 'Medium', label: 'Medium'},
    {value: 'High', label: 'High'},
    {value: 'Urgent', label: 'Urgent'}
  ]

  function updateDetails() {

      // if category has been changed
      if (previousCategory.value !== category.value) {
        dispatch(
          changeCategory({
            newCat: category.value,
            oldCat: previousCategory.value,
            objective: details
          })
        );
        setPreviousCategory(category);
        return;
      }
      
      // if details have been changed
      if (previousDetails !== details) {
        dispatch(updateObjective({catId: category.value, objective: details}))
        setPreviousDetails(details);
      }        

  }

  return (
      parent && createPortal(
        <div className='objective-details' ref={panel} data-no-dnd="true">

          <p className='objective-details__header'> Task Details </p>
          <hr className='objective-details__divider'/>


          <div className='objective-details__column'>
            <label className='objective-details__label' htmlFor='name'> Title </label>
            <textarea className='objective-details__title-input' name='title' value={details.name} 
            onChange={(e) => setDetails({ ...details, name: e.target.value})}
            onBlur={() => updateDetails()}/>
          </div>
        
          <div className='objective-details__column'>

            <div className='objective-details__row'>
              <label className='objective-details__label' htmlFor='priority'> Priority </label>
              <Select options={priorityOptions} value={details.priority} onChange={(e) => setDetails({ ...details, priority: e.value})}/>
            </div>

            <div className='objective-details__row'>
              <label className='objective-details__label' htmlFor='progress'> Progress </label>
              <Select options={progressOptions} value={details.progress} onChange={(e) => setDetails({...details, progress: e.value})}/>
            </div>

            <div className='objective-details__row'>
              <label className='objective-details__label' htmlFor='category'> Category </label>
              <Select options={categoryOptions} value={category.value} label={category.label} onChange={(e) => setCategory(e)}/>
            </div>

            <div className='objective-details__row'>
              <label className='objective-details__label' htmlFor='starting-date'> Starting Date </label>
              <DatePicker value={details.startingDate} onChange={(e) => setDate(e, "STARTING_DATE")} name="starting-date"/>
            </div>

            <div className='objective-details__row'>
              <label className='objective-details__label' htmlFor='due-date'> Due Date </label>
              <DatePicker value={details.dueDate} onChange={(e) => setDate(e, "DUE_DATE")} name="due-date"/> 
            </div>
            
          </div>

          <div className='objective-details__column'>
            <label className='objective-details__label' htmlFor='notes'> Description </label>
            <textarea className='objective-details__description-input' name='notes' value={details.notes} 
            onChange={(e) => setDetails({ ...details, notes: e.target.value})}
            onBlur={() => updateDetails()}/>
          </div>

      </div>, parent)
  );
}