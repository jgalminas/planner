import { useState, Fragment } from 'react';
import { ReactComponent as CalendarIcon } from './icons/calendar.svg'
import { ObjectiveOptions } from './ObjectiveOptions.js';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Priority } from '../util/Constants';
import { useNavigate } from 'react-router-dom';

export function SortableObjective({ data, catId }) {

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: data.id, data: { type: 'Objective'} });

  const animations = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={animations} {...attributes} {...listeners}>
      <Objective isDragging={isDragging} catId={catId} data={data}/>
    </div>
  );

}

export function Objective({isDragging, catId, data}) {
    
    const [hover, setHover] = useState(false);
    const [isOptionsOpen, setOptionsOpen] = useState(false);

    const navigate = useNavigate();

    const objectiveClassName = data?.progress === "Completed" ? "objective --completed" : "objective";
    const className = isDragging ? `${objectiveClassName} dragging` : objectiveClassName;

    return (
      <Fragment>
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => !isOptionsOpen && setHover(false)} onClick={() => navigate(data.id)} className={className}>
          {!isDragging && 
            <Fragment>
              
              <PriorityLabel priority={data?.priority}/>
              <p className="objective__title"> {data?.name} </p>
              <DueDate dueDate={data?.dueDate}/>

              {hover && <ObjectiveOptions data={{ details: data, catId }} setOpen={(e) => setOptionsOpen(e)} setHover={setHover} />}
                
            </Fragment>}
          
        </div>

      </Fragment>
    );
}

export function DueDate({ dueDate }) {

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const date = new Date(dueDate);
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth();
  const dateDay = date.getDate();

  const dateString = (dateYear) === new Date().getFullYear() ?
  `${dateDay} ${months[dateMonth]}` :
  `${dateDay} ${months[dateMonth]} ${dateYear}`

  return (
    <Fragment>
    {dueDate && dueDate !== '' &&
      <Fragment>
        <hr className='due-date__divider'/>
      <div className='due-date'>
        <CalendarIcon className='due-date__icon'/>
        <p className='due-date__text'> {dateString} </p>
      </div>
      </Fragment>}
    </Fragment>
  )
}

export function PriorityLabel({ priority }) {

  const className = priority === Priority.HIGH ? "priority-label --high" : "priority-label --urgent";

  return (
    <Fragment>
    {(priority === Priority.URGENT || priority === Priority.HIGH) &&
      <div className={className}> </div>}
    </Fragment>
  )
}