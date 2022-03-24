import { useState, useEffect, useRef, Fragment } from 'react';
import { ReactComponent as AddIcon } from './icons/add.svg';
import { ReactComponent as OptionsIconV } from './icons/options_v.svg';
import { SortableObjective } from './Objective.js';
import { OptionsDropdown } from './OptionsDropdown';
import { ReactComponent as Check} from './icons/check.svg';
import { ReactComponent as Close} from './icons/close.svg';

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import { useDispatch } from 'react-redux';
import { createObjective, deleteCategory, renameCategory } from './slices/currentBoardSlice';
import { useLocation } from 'react-router-dom';

export function Category(props) {

  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  
  const { setNodeRef } = useDroppable({
    id: props.id,
  });

  const {
    attributes,
    listeners,
    setNodeRef: sortRef,
    transform,
    transition,
    isDragging,
  } = useSortable({id: props.id, data: {
    type: 'Category'
  }});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <SortableContext id={props.id} items={props.objectives} strategy={verticalListSortingStrategy}>
      
      <div className={isDragging ? "dragging category h-100" : "category h-100"} ref={sortRef} style={style} {...attributes} {...listeners } >

          {!isDragging && 
            <CategoryHeader show={() => setShowForm(!showForm)} id={props.id} name={props.name}/>}

          <div className="flex col gap-15 p-10 cat-content" ref={setNodeRef}>
          {!isDragging &&
          <Fragment>
          {props.objectives.map((item) => {
          return <SortableObjective catId={props.id} key={item.id} data={item} />;
          })}
          {showForm && <NewObjectiveInput catId={props.id} show={() => setShowForm(!showForm)}/>}
          </Fragment>}
          </div> 

      </div>

    </SortableContext>
  );
}

//Category header component which is rendered at the top of the category container
export function CategoryHeader({id, name, show}) {

  const [showRenameInput, setShowRenameInput] = useState(false);
  const [nameInput, setNameInput] = useState(name);

  const { pathname } = useLocation();
  const boardId = pathname.split('/')[1];

  const dispatch = useDispatch();

  const options = [
    {name: "Rename", click: () => {setShowRenameInput(!showRenameInput);}},
    {name: "Delete", click: () => dispatch(deleteCategory({boardId: boardId, catId: id}))}
  ];

  return (
    <div className="category-header p-10 flex row no-wrap">

      {showRenameInput ? 
        <div className='rename-container flex'>
          <input data-no-dnd="true" autoFocus className='rename-input' value={nameInput} onChange={(e) => setNameInput(e.target.value)} type="text"/>
          <div className='align-left flex'>
          <button onClick={() => {dispatch(renameCategory({catId: id, name: nameInput})); setShowRenameInput(false);}} className='icon-button pointer'> <Check/> </button>
          <button onClick={() => setShowRenameInput(false)} className='icon-button pointer'> <Close/> </button>
          </div>
        </div>
      : <Fragment>
          <span className="category-title text-overflow"> {nameInput} </span>
          <button onClick={show} className="icon-button align-right w-auto pointer">
            <AddIcon stroke="#4B4B4B" />
          </button>
          <OptionsDropdown icon={<OptionsIconV/>} options={options} />
        </Fragment>}

    </div>
  );
}

export function NewObjectiveInput(props) {

  const [name, setName] = useState("");
  const button = useRef();

  const dispatch = useDispatch();

  //Component will scroll into view once it is mounted.
  useEffect(() => {
    button.current.scrollIntoView();
  }, []) 

  return (

    <div className="flex wrap w-100 objective soft-shadow p-0" data-no-dnd="true">
      <div className="w-100 h-fit p-10">
        <input autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-100 h-fit new-objective-input"
          type="text"
          placeholder="Enter name">
        </input>
      </div>
      <button
        ref={button}
        onClick={() => {
          dispatch(createObjective({catId: props.catId, name: name}));
          props.show();
        }}
        className="new-objective-button w-100 h-fit align-end">
        Add Task
      </button>
    </div>
  )
}