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
import { useDispatch, useSelector } from 'react-redux';
import { createObjective, deleteCategory, renameCategory } from './slices/currentBoardSlice';
import { useLocation } from 'react-router-dom';
import { DatePicker } from './DatePicker';

export function Category({ id, objectives, name }) {

  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  
  const { setNodeRef } = useDroppable({
    id: id,
  });

  const {
    attributes,
    listeners,
    setNodeRef: sortRef,
    transform,
    transition,
    isDragging,
  } = useSortable({id: id, data: {
    type: 'Category'
  }});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <SortableContext id={id} items={objectives} strategy={verticalListSortingStrategy}>
      
      <div className={isDragging ? "category dragging" : "category"} ref={sortRef} style={style} {...attributes} {...listeners } >

          {!isDragging && 
            <CategoryHeader show={() => setShowForm(!showForm)} id={id} name={name}/>}

          <div className="flex col gap-15 p-10 cat-content" ref={setNodeRef}>
          {!isDragging &&
          <Fragment>
          {objectives.map((item) => {
          return <SortableObjective catId={id} key={item.id} data={item} />;
          })}

          {showForm && <NewObjectiveInput catId={id} show={() => setShowForm(!showForm)}/>}
          </Fragment>}

          </div> 

      </div>

    </SortableContext>
  );
}

//Category header component which is rendered at the top of the category container
export function CategoryHeader({ id, name, show }) {

  const [showRenameInput, setShowRenameInput] = useState(false);
  const [nameInput, setNameInput] = useState(name);
  const boardId = useSelector((state) => state.currentBoard.value.boardId);
  const dispatch = useDispatch();

  const options = [
    {name: "Rename", click: () => {setShowRenameInput(!showRenameInput);}},
    {name: "Delete", click: () => dispatch(deleteCategory({boardId: boardId, catId: id}))}
  ];

  return (
    <div className="category__header">

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

  const [name, setName] = useState('');
  const button = useRef();

  const dispatch = useDispatch();

  //Component will scroll into view once it is mounted.
  useEffect(() => {
    button.current.scrollIntoView();
  }, []) 

  return (

    <div className='new-objective' data-no-dnd="true">
      <form autoComplete='off' className='new-objective__form' onSubmit={(e) => {
          e.preventDefault();
          dispatch(createObjective({catId: props.catId, name: name}));
          props.show();
      }}>
        <label className='new-objective__form__label' htmlFor='text'> Title </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='new-objective__form__input' autoFocus name='text'/>
        <input type="submit" value="Add" ref={button} className='new-objective__form__button'/>
      </form>
    </div>
  )
}