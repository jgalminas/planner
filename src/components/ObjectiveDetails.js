import { ReactComponent as CloseIcon} from './icons/close.svg';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useData } from './contexts/DataContext';
import useClickOutside from './hooks/ClickOutside';
import { useSelector } from 'react-redux';

export function ObjectiveDetails(props) {

    const [details, setDetails] = useState(props.data);
    const [category, setCategory] = useState({selected: {}, others: []});
    const dataContext = useData();

    const modal = useRef();

    const categories = useSelector((state) => state.currentBoard.value.categories);

    useEffect(() => {
      getCurrentCategory(props.catId);
    }, [])

    useClickOutside(null, modal, () => props.close());

    function getCurrentCategory(catId) {
      const current = categories.find((cat) => cat.id === catId);
      const rest = categories.filter((cat) => cat.id !== current.id);

      setCategory({
        selected: current,
        others: rest
      });
    }

    function updateDetails() {

        if (details !== props.data || props.catId !== category.selected.id) {
            dataContext.updateObjective(props.catId, details, category.selected.id);
        }
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
          <select className='select' value={details.priority} onChange={(e) => setDetails({ ...details, priority: e.target.value})} name='priority'>
            <option value="Low"> Low </option>
            <option value="Medium"> Medium </option>
            <option value="High"> High </option>
            <option value="Urgent"> Urgent </option>
          </select>
        </div>

        <div className="flex col gap-10">
            <label htmlFor='progress'> Progress </label>
          <select className='select' value={details.progress} onChange={(e) => setDetails({ ...details, progress: e.target.value})} name='progress'>
            <option value="Not Started"> Not Started </option>
            <option value="In Progress"> In Progress </option>
            <option value="Completed"> Completed </option>
          </select>
        </div>

        <div className="flex col gap-10">
            <label htmlFor='category'> Category </label>

            <select className='select' value={category.selected.id} onChange={(e) => getCurrentCategory(e.target.value)} name='progress'>
            <option value={category.selected.id}> {category.selected.name} </option>
            {category.others.map((cat) => {
              return <option key={cat.id} value={cat.id}> {cat.name} </option>
            })}
            </select>
          
        </div>
        
        </div>

        <textarea className="od-details-input" value={details.notes} onChange={(e) => setDetails({ ...details, notes: e.target.value})}/>
      </div>
      </div>)
      , document.getElementById('root')
    )
}