import React, { Component, useState } from 'react';
import { ReactComponent as AddIcon } from './icons/add.svg';
import { ReactComponent as OptionsIcon } from './icons/options_v.svg'

import { OptionsDropdown } from './OptionsDropdown.js'

export function Objective(props) {
    
    const [hover, setHover] = useState(false);


    function renameObjective(id) {
        console.log("Rename => ", id);
    }

    function deleteObjective(id) {
        console.log("delete => ", id);
        //props.delete(props.data.id);
    }

    return (
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="flex wrap p-10 objective soft-shadow"> 
                <p className="h-fit w-100 m-0"> {props.data.name} </p>
                {(hover) ?
                <OptionsDropdown>
                    <button className='category-options-item m-0' onClick={() => renameObjective(props.data.id)}> Rename </button>
                    <button className='category-options-item m-0' onClick={() => props.delete(props.data.id, props.catId)}> Delete </button>
                </OptionsDropdown>
                : null }
        </div>
    );
}

