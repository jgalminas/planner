import { useState, useEffect, useRef, Fragment } from 'react';
import { ReactComponent as AddIcon } from './icons/plus-circle.svg';
import { ReactComponent as OptionsIconV } from './icons/options_v.svg';
import { SortableObjective } from './Objective.js';
import { OptionsDropdown } from './OptionsDropdown';
import { ReactComponent as CheckIcon } from './icons/check-circle.svg';
import { ReactComponent as CloseIcon } from './icons/x-circle.svg';
import { ReactComponent as EditIcon } from './icons/edit.svg';
import { ReactComponent as TrashIcon } from './icons/trash.svg';


import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import { useDispatch, useSelector } from 'react-redux';
import { createObjective, deleteCategory, renameCategory } from './slices/currentBoardSlice';

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

  const categoryClass = isDragging ? 'category dragging' : 'category';

  return (
    <SortableContext id={id} items={objectives} strategy={verticalListSortingStrategy}>
      
      <div className={categoryClass} ref={sortRef} style={style} {...attributes} {...listeners } >
          
          { // hide header while category is being dragged
          !isDragging && <CategoryHeader show={() => setShowForm(!showForm)} id={id} name={name}/>}

          <div className="category__content" ref={setNodeRef}>
          { // hide content while dragging
          !isDragging &&
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

  const button = useRef();
  const [showOptions, setShowOptions] = useState(false);

  const options = [
    {name: "Rename", icon: <EditIcon/>, type: 'regular', click: () => {setShowRenameInput(!showRenameInput);}},
    {name: "Delete", icon: <TrashIcon/>, type: 'warning', click: () => dispatch(deleteCategory({boardId: boardId, catId: id}))}
  ];

  return (
    <div className="category__header">

      {showRenameInput ? 
        <div className='rename-container'>
          <input data-no-dnd='true' autoFocus className='rename-container__input' value={nameInput} onChange={(e) => setNameInput(e.target.value)} type="text"/>
          
          <div className='rename-container__button-wrapper'>
          <button onClick={() => {dispatch(renameCategory({catId: id, name: nameInput})); setShowRenameInput(false);}}
          className='rename-container__button-wrapper__button'>
              <CheckIcon/>
          </button>
          <button onClick={() => setShowRenameInput(false)} className='rename-container__button-wrapper__button'> <CloseIcon/> </button>
          </div>

        </div>
      : <Fragment>
          <p className='category__header__title'> {nameInput} </p>

          <button onClick={show} className="category__header__add-button">
            <AddIcon/>
          </button>

          <button ref={button} onClick={() => setShowOptions(!showOptions)} className="category__header__options-button">
            <OptionsIconV/>
          </button>

          <OptionsDropdown button={button} options={options} visible={showOptions} setVisible={setShowOptions}/>

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