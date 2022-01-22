import React, { Component, useState } from 'react';
import { ReactComponent as AddIcon } from './icons/add.svg';
import { ReactComponent as OptionsIcon } from './icons/options_v.svg'

import { OptionsDropdown } from './OptionsDropdown.js'

export function Objective(props) {
    
    const [data, setData] = useState(props.data);
    const [hover, setHover] = useState(false);


    function renameObjective() {
        console.log("To Do");
    }

    function deleteObjective() {
        props.del(data.objectiveId);
    }

    return (
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="flex wrap p-10 objective soft-shadow"> 
                <p className="h-fit w-100 m-0"> {props.data.name} </p>
                {(hover) ? <OptionsDropdown options={ [{click: renameObjective, name: 'Rename'}, {click: deleteObjective, name: 'Delete'}] }/> : null }
        </div>
    );
}