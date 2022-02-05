import { useState, useEffect, useRef } from 'react';
import { ReactComponent as AddIcon } from './icons/add.svg';
import { ReactComponent as OptionsIconV } from './icons/options_v.svg';
import { Objective } from './Objective.js';
import { OptionsDropdown } from './OptionsDropdown';
import { useData } from './contexts/DataContext';

export function Category(props) {

  const [showForm, setShowForm] = useState(false);
  const dataContext = useData();

  const options = [
    {name: "Delete", click: () => dataContext.deleteCategory(props.id)}
  ];

  return (
  <div className="category h-100">
        <CategoryHeader show={() => setShowForm(!showForm)} id={props.id} name={props.name}>
          <OptionsDropdown icon={<OptionsIconV/>} options={options} />
        </CategoryHeader>
          <div className="flex col gap-15 p-10 cat-content">
          {props.objectives.map((item, key) => {
          return <Objective index={key} catId={props.id} key={item.id} data={item} />;
          })}
          {showForm && <NewObjectiveInput catId={props.id} show={() => setShowForm(!showForm)}/>}
          </div>
      </div>
  );
}

//Category header component which is rendered at the top of the category container
export function CategoryHeader(props) {

  return (
    <div className="category-header p-10 flex row no-wrap">
      <p className="w-auto md-title m-0"> {props.name} </p>
      <button onClick={props.show} className="icon-button align-right w-auto pointer">
        <AddIcon stroke="#4B4B4B" />
      </button>
      {props.children}
    </div>
  );
}

export function NewObjectiveInput(props) {

  const [name, setName] = useState("");
  const dataContext = useData();
  const button = useRef();

  useEffect(() => {
    button.current.scrollIntoView({
      behavior: "smooth",
    });
  }, []) 

  return (
    <div className="flex wrap w-100 objective soft-shadow p-0">
      <div className="w-100 h-fit p-10">
        <input autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-auto h-fit new-objective-input"
          type="text"
          placeholder="Enter name">
        </input>
      </div>
      <button
        ref={button}
        onClick={() => {
          dataContext.createObjective(props.catId, name);
          props.show();
        }}
        className="new-objective-button w-100 h-fit align-end">
        Add Task
      </button>
    </div>
  )
}