import React, { Component, useState } from 'react';
import { ReactComponent as AddIcon } from './icons/add.svg';
import { ReactComponent as OptionsIconV } from './icons/options_v.svg'
import { DatePicker } from './DatePicker';

import { OptionsDropdown } from './OptionsDropdown.js'

export function Objective(props) {
    
    const [hover, setHover] = useState(false);

    const options = [
        {name: "Rename", click: () => props.renamere(props.data.id)},
        {name: "Delete", click: () => props.delete(props.data.id, props.catId)}
    ]

    return (
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="flex col p-10 objective gap-10 soft-shadow"> 
                <p className="h-fit w-100"> {props.data.name} </p>
                {(hover) ?
                <OptionsDropdown icon={<OptionsIconV/>} options={options}/>
                : null }
        </div>
    );
}

