import { useEffect, useRef, useState } from 'react';
import { ReactComponent as OptionsIconV } from './icons/options_v.svg'
import { ObjectiveDetails } from './ObjectiveDetails.js';
import { OptionsDropdown } from './OptionsDropdown.js'
import { useData } from './contexts/DataContext';

export function Objective(props) {
    
    const [hover, setHover] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const dataContext = useData();
    
    const options = [
        {name: "Rename", click: () => props.rename(props.data.id)},
        {name: "Delete", click: () => dataContext.deleteObjective(props.data.id, props.catId)}
    ]
    
    return (
        <div>
            <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => setShowDetails(true)}
            className="flex col p-10 objective gap-10 soft-shadow pointer"> 
           <p className="h-fit w-100"> {props.data.name} </p>
           {hover &&
           <div className='objective-options-button'>
               <OptionsDropdown icon={<OptionsIconV/>} options={options}/>
           </div>}
            </div>
        {showDetails && <ObjectiveDetails catId={props.catId} data={props.data} close={() => setShowDetails(false)}/>}
        </div>
    );
}

