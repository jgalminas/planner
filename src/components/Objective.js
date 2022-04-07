import { useState, Fragment } from 'react';
import { ReactComponent as OptionsIconV } from './icons/options_v.svg'
import { ReactComponent as CalendarIcon } from './icons/calendar.svg'
import { ObjectiveDetails } from './ObjectiveDetails.js';
import { OptionsDropdown } from './OptionsDropdown.js'

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from 'react-redux';
import { deleteObjective } from './slices/currentBoardSlice';
import { addItem } from './slices/localStorageSlice';
import { useLocation } from 'react-router-dom';

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
    const [showDetails, setShowDetails] = useState(false);
    const { pathname } = useLocation();
    const boardId = pathname.split("/")[1];

    const dispatch = useDispatch();
    
    const options = [
        {name: "Delete", click: () => {dispatch(deleteObjective({objId: data.id, catId: catId})); dispatch(addItem({boardId: boardId, data: {...data, catId: catId}}))}}
    ]

    const objectiveClassName = data.progress === "Completed" ? "objective completed" : "objective";
    const className = isDragging ? `${objectiveClassName} dragging` : `flex col p-10 ${objectiveClassName} gap-10 soft-shadow pointer`;

    return (
      <div>
        <div 
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => setShowDetails(true)}
          className={className}>
          {!isDragging && (
            <Fragment>
              <p className="objective-title"> {data?.name} </p>
              <div className="flex due-date">
                {data?.dueDate !== '' ? (
                  <Fragment>
                    <CalendarIcon />
                    <p>{new Date(data?.dueDate).toLocaleDateString()} </p>
                  </Fragment>
                ) : null}
              </div>
              {hover && (
                <div className="objective-options-button">
                  <OptionsDropdown icon={<OptionsIconV />} options={options} />
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

