import { useState, Fragment, useEffect } from 'react';
import { ReactComponent as OptionsIconV } from './icons/options_v.svg'
import { ReactComponent as CalendarIcon } from './icons/calendar.svg'
import { ObjectiveDetails } from './ObjectiveDetails.js';
import { ObjectiveOptions } from './ObjectiveOptions.js';

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from 'react-redux';
import { deleteObjective } from './slices/currentBoardSlice';
import { addItem } from './slices/localStorageSlice';
import { useLocation } from 'react-router-dom';
import { Priority } from '../util/Constants';

export function SortableObjective({ data, catId }) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: data.id, data: {
    type: 'Objective'}
  });

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
    const [showDetails, setShowDetails] = useState(false);
    const { pathname } = useLocation();
    const boardId = pathname.split("/")[1];

    const dispatch = useDispatch();
    
    const options = [
        {name: "Delete", click: () => {dispatch(deleteObjective({objId: data.id, catId: catId})); dispatch(addItem({boardId: boardId, data: {...data, catId: catId}}))}}
    ]

    const objectiveClassName = data?.progress === "Completed" ? "objective completed" : "objective";
    const className = isDragging ? `${objectiveClassName} dragging` : `flex col p-10 ${objectiveClassName} gap-10 pointer`;

    return (
      <div>
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => !isOptionsOpen && setHover(false)} onClick={() => setShowDetails(true)} className={className}>
          {!isDragging && (
            <Fragment>

             <PriorityLabel priority={data?.priority}/>


              <p className="objective-title"> {data?.name} </p>

              <DueDate dueDate={data?.dueDate}/>

              {hover && (
                <div className="objective-options-button">
                  <ObjectiveOptions icon={<OptionsIconV />} options={options} isOpen={(e) => setOptionsOpen(e)} setHover={setHover} />
                </div>
              )}
            </Fragment>
          )}
          
        </div>
        {showDetails && (
          <ObjectiveDetails
            catId={catId}
            data={data}
            close={() => setShowDetails(false)}
          />
        )}
      </div>
    );
}

export function DueDate({dueDate}) {

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const date = new Date(dueDate);
  const dateString = date.getFullYear() === new Date().getFullYear() ? `${date.getDate()} ${months[date.getMonth()]}` : `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`

  return (
    <div className="flex due-date">
    {dueDate != null & dueDate !== '' ? (
      <Fragment>
        <CalendarIcon />
        <p> {dateString} </p>
      </Fragment>
    ) : null}
  </div>
  )
}

export function PriorityLabel({priority}) {

  const className = priority === Priority.HIGH ? "priority orange" : "priority red"

  return (
    <div className="flex">
    {priority != null & priority !== '' & priority === Priority.URGENT || priority === Priority.HIGH ? (
        <p className={className}> </p>
    ) : null}
  </div>
  )
}
