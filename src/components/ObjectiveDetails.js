import { ReactComponent as CloseIcon} from './icons/close.svg';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useData } from './contexts/DataContext';
import useClickOutside from './hooks/ClickOutside';
import { useSelector } from 'react-redux';
import { DatePicker } from './DatePicker';
import Select from './Select';

export function ObjectiveDetails(props) {

  const categories = useSelector((state) => state.currentBoard.value.categories);

    const [details, setDetails] = useState(props.data);
    const [categoryOptions, setCategoryOptions] = useState({current: {value: '', label: ''}, options: []});
    const dataContext = useData();

    const modal = useRef();

    useEffect(() => {

      const currentCat = categories.find((cat) => cat.id === props.catId);

      updateCategories({value: currentCat.id, label: currentCat.name})
      
    }, [])

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

    useClickOutside(null, modal, () => props.close());


    function updateDetails() {

        // if (details !== props.data || props.catId !== category.selected.id) {
        //     dataContext.updateObjective(props.catId, details, category.selected.id);
        // }
    }

    return createPortal(
      (<div className='modal-background'>
        <div className="flex col objective-details-modal gap-30" ref={modal}>
        <button
          onClick={() => {
            props.close();
            updateDetails();
          }}
          className="absolute exit-button p-0 pointer"
        >
          <CloseIcon />
        </button>
        
        <input
          className="od-borderless-input"
          value={details.name}
          onChange={(e) => setDetails({ ...details, name: e.target.value})}
          type="text"/>
        
        <div className='flex row gap-30'>

        <div className="flex col gap-10">
            <label htmlFor='priority'> Priority </label>
          <Select options={priorityOptions} value={details.priority} onChange={(e) => setDetails({ ...details, priority: e.value})}/>
        </div>

        <div className="flex col gap-10">
            <label htmlFor='progress'> Progress </label>
            <Select options={progressOptions} value={details.progress} onChange={(e) => setDetails({...details, progress: e.value})}/>
        </div>

        <div className="flex col gap-10">
            <label htmlFor='category'> Category </label>
            <Select options={categoryOptions.options} value={categoryOptions.current.label} onChange={(e) => updateCategories(e)}/>
        </div>
        
        </div>

        <DatePicker/>
        <textarea className="od-details-input" value={details.notes} onChange={(e) => setDetails({ ...details, notes: e.target.value})}/>
      </div>

      </div>)
      , document.getElementById('root')
    )
}