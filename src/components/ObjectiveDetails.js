import { ReactComponent as CloseIcon} from './icons/close.svg';
import { useState } from 'react';

export function ObjectiveDetails(props) {

    const [name, setName] = useState(props.data.name);

    return (
        <div className="flex col objective-details-modal gap-10">
          <button onClick={props.close} className="absolute exit-button p-0 pointer">
                <CloseIcon/>
          </button>
            <input className='od-borderless-input' value={name} onChange={(e) => setName(e.target.value)} type="text"/>
            <div className='flex row gap-30'>
            <Select label="Category"/>
            <Select label="Priority"/>
            <Select label="Progress"/>
            </div>
            <div className='flex row gap-30'>
            <Select/>
            <Select/>
            </div>
            <textarea className='od-details-input'>

            </textarea>
        </div>
    )
}

function Select(props) {
    return(
        <div className='flex col'>
            <label htmlFor='priority' className='select-label'> Priority </label>
            <select className='select' name="priority">
                <option value="grapefruit w-fit">Grapefruit</option>
                <option value="lime">Lime</option>
                <option selected value="coconut">Coconut</option>
                <option value="mango">Mango</option>
            </select>
            </div>
    )
}