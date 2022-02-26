import { useState, Fragment } from 'react';
import { ReactComponent as OptionsIconV } from './icons/options_v.svg'
import { ObjectiveDetails } from './ObjectiveDetails.js';
import { OptionsDropdown } from './OptionsDropdown.js'

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from 'react-redux';
import { deleteObjective } from './slices/currentBoardSlice';

export function SortableObjective({ data, catId }) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: data.id, data: {
    type: 'Objective'
  } });

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

    const dispatch = useDispatch();
    
    const options = [
        {name: "Rename", click: () => {console.log("rename")}},
        {name: "Delete", click: () => dispatch(deleteObjective({objId: data.id, catId: catId}))}
    ]

    const className = isDragging ? "objective dragging" : "flex col p-10 objective gap-10 soft-shadow pointer"

    return (
        <div>
            <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={(e) => {setShowDetails(true)}}
            className={className}>
            {!isDragging &&
            <Fragment>
           <p className="h-fit w-100"> {data?.name} </p>

           {hover &&
           <div className='objective-options-button'>
               <OptionsDropdown icon={<OptionsIconV/>} options={options}/>
           </div>}
           </Fragment>} 
            </div>
        {showDetails && <ObjectiveDetails catId={catId} data={data} close={() => setShowDetails(false)}/>}
        </div>
    );
}

