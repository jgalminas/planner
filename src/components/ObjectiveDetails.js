import { ReactComponent as CloseIcon} from './icons/close.svg';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import useClickOutside from './hooks/ClickOutside';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from './DatePicker';
import Select from './Select';
import { updateObjective, changeCategory } from './slices/currentBoardSlice';

export function ObjectiveDetails(props) {

  const categories = useSelector((state) => state.currentBoard.value.categories);

    const [details, setDetails] = useState(props.data);
    const [categoryOptions, setCategoryOptions] = useState({current: {value: '', label: ''}, options: []});
    const dispatch = useDispatch();

    const modal = useRef();

    useEffect(() => {

      const currentCat = categories.find((cat) => cat.id === props.catId);
      updateCategories({value: currentCat.id, label: currentCat.name})
      
    }, [])

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

    function updateCategories({value, label}) {

      const categoryOptions = categories.filter((cat) => cat.id !== value).map((option) => {
        return {value: option.id, label: option.name}
      })

      setCategoryOptions(
        {current: {value, label},
         options: categoryOptions
        })
    }

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

    useClickOutside(null, modal, () => {
      props.close();
      updateDetails();
    });

    function updateDetails() {

        if (props.catId !== categoryOptions.current.value) {
          dispatch(
            changeCategory({
              newCat: categoryOptions.current.value,
              oldCat: props.catId,
              objective: details
            })
          );
          return;
        }
        
        if (props.data !== details) {
          dispatch(updateObjective({catId: props.catId, objective: details}))
        }        

    }


    return createPortal(
      (<div className='modal-background' data-no-dnd="true">
        <div className="flex col modal-contents gap-30" ref={modal}>
        <button
          onClick={() => {
            props.close();
            updateDetails();
          }}
          className="absolute exit-button p-0 pointer"
        >
          <CloseIcon />
        </button>

        <div className="flex col gap-5">
            <label className='label' htmlFor='name'> Title </label>
            <input
          className="objective-name-input"
          value={details.name}
          onChange={(e) => setDetails({ ...details, name: e.target.value})}
          type="text"
          name="name"/>
        </div>
        
        <div className='flex row gap-30'>

        <div className="flex col gap-5">
            <label className='label' htmlFor='priority'> Priority </label>
          <Select options={priorityOptions} value={details.priority} onChange={(e) => setDetails({ ...details, priority: e.value})}/>
        </div>

        <div className="flex col gap-5">
            <label className='label' htmlFor='progress'> Progress </label>
            <Select options={progressOptions} value={details.progress} onChange={(e) => setDetails({...details, progress: e.value})}/>
        </div>

        <div className="flex col gap-5">
            <label className='label' htmlFor='category'> Category </label>
            <Select options={categoryOptions.options} value={categoryOptions.current.label} onChange={(e) => updateCategories(e)}/>
        </div>
        
        </div>

        <div className='flex row gap-30'>

        <div className="flex col gap-5">
          <label className='label' htmlFor='starting-date'> Starting Date </label>
          <DatePicker value={details.startingDate} onChange={(e) => setDate(e, "STARTING_DATE")} name="starting-date"/>        
        </div>

        <div className="flex col gap-5">
          <label className='label' htmlFor='due-date'> Due Date </label>
          <DatePicker value={details.dueDate} onChange={(e) => setDate(e, "DUE_DATE")} name="due-date"/>        
        </div>

        </div>

        <div className="flex col gap-5">
            <label className='label' htmlFor='notes'> Details </label>
            <textarea className="notes-input" name='notes' value={details.notes} onChange={(e) => setDetails({ ...details, notes: e.target.value})}/>

        </div>
      </div>

      </div>)
      , document.getElementById('root')
    )
}