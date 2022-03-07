import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from './Category';
import { OptionsDropdown } from './OptionsDropdown';
import { ReactComponent as Dropdown } from './icons/dropdown.svg';
import { ReactComponent as Check} from './icons/check.svg';
import { ReactComponent as Close} from './icons/close.svg';
import { Objective } from './Objective';
import { useAuth } from './contexts/AuthContext';

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
  TouchSensor,
  rectIntersection,
  MeasuringStrategy
} from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import { useSelector, useDispatch } from 'react-redux';
import { deleteBoard, createCategory, moveCategory, moveObjective, reorderObjective, updateCategories, renameBoard } from './slices/currentBoardSlice';
import { subscribeToCurrentBoard } from '../firebase/subscriptions';


export function Board(props) {

  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const [activeId, setActiveId] = useState();
  const [activeType, setActiveType] = useState();

  const currentBoard = useSelector((state) => state.currentBoard.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activationConstraint = {
    distance: 15
  }

  // fix for trying to click on a task when no distance is set:
  // https://github.com/clauderic/dnd-kit/issues/477

  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint }), useSensor(TouchSensor, { activationConstraint }));


  // Everything inside this useEffect is called when the component mounts and each time the board ID changes.
  useEffect(() => {

    const { name, boardId, dataId } = props.location;
    subscribeToCurrentBoard(name, dataId, boardId, navigate, dispatch);

  }, [props.location.boardId]);

  if (!currentBoard.boardId) {
    return null;
  }

  //Clean this up a bit
  function newCategoryInput(event) {
    if (event.target instanceof HTMLInputElement) {
      if ((event.target.value.trim() === '') || undefined) {
        setShowNewCategoryInput(false);
      } else {
        dispatch(createCategory({name: event.target.value.trim()}))
        setShowNewCategoryInput(false);
      }
    } else {
      setShowNewCategoryInput(true);
    }
  }

  function renderOverlay(activeId, activeType) {

    if (activeType === 'Category') {
     return <Category id={activeId} {...currentBoard.categories[findContainer(activeId)]} />
    } else if (activeType === 'Objective') {
      return <Objective id={activeId} data={currentBoard.categories[findContainer(activeId)].objectives.find((obj) => obj.id === activeId)}/>
    } else {
      return null;
    }

  }

  function findContainer(id) {
    // need to check if the over id the container itself
    // OR find the container based on the item id
    const categories = currentBoard.categories;

    const containerIndex = Object.keys(categories).find(
      (key) => categories[key].id === id
    );
    if (containerIndex !== undefined) {
      return containerIndex;
    }
    
    return Object.keys(categories).find((key) => categories[key].objectives.find((obj) => obj.id === id));
  }

  function handleDragStart(event) {
    const { active } = event;

    setActiveId(active.id);
    setActiveType(active.data.current.type);
  }

  function handleDragOver(event) {
    const { active, over } = event;
    const { id } = active;
    const overId = over?.id;

    if (!overId) {
      return;
    }

    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);
    
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    if (active.data.current.type === 'Category') {

      dispatch((moveCategory({
        active: activeContainer,
        over: overContainer
      })))

    } else if (active.data.current.type === 'Objective') {

        const categories = currentBoard.categories;
        const overItems = categories[overContainer].objectives;
  
        const overIndex = over.data.current.sortable.index;
  
        const isBelowOverItem =
        over &&
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
  
        const modifier = isBelowOverItem ? 1 : 0;
  
        const newIndex =
          overIndex >= 0 ? overIndex + modifier : overItems.length + 1;

        dispatch(
          moveObjective({
            active: activeContainer,
            over: overContainer,
            newIndex: newIndex,
            activeObj: active.id,
          })
        );  
  }

}

  function handleDragEnd(event) {
    const { active, over } = event;
    const { id } = active;
    const overId = over?.id;

    //Find containers from active and over id
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    // Get active item and over item indexes
    const activeIndex = active.data.current.sortable.index;
    const overIndex = over.data.current.type !== 'Category' ? over.data.current.sortable.index : 0;

    if (activeIndex !== overIndex) {
      
      if (active.data.current.type === 'Objective') {

        dispatch(
          reorderObjective({
            active: activeContainer,
            activeIndex: activeIndex,
            overIndex: overIndex,
          })
        );

        dispatch(updateCategories())

      } else if (active.data.current.type === 'Category') {

          dispatch(updateCategories())

      } 
    } else {

      // need to stop the categories from updating if the task hasnt moved from original position

      dispatch(updateCategories())

    }

    // Reset activeId and activeType
    setActiveId(null);
    setActiveType(null);
}


  return (
    <div className='h-100 board'>
      <BoardHeader {...currentBoard}/>

    {currentBoard.categories && 
    <div className="flex row no-wrap gap-15 board-content">

    <DndContext
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}>

    <SortableContext id={currentBoard.id} items={currentBoard.categories} strategy={horizontalListSortingStrategy}>
    {currentBoard.categories.map((data) => {
      return (
        <Category key={data.id} id={data.id} {...data}/>
      );
    })}

    </SortableContext> 

    <DragOverlay>
      <div className='h-100 drag-overlay'>
        {renderOverlay(activeId, activeType)}
      </div>
    </DragOverlay>

    </DndContext>
    <NewCategoryInput show={showNewCategoryInput} click={newCategoryInput}/>
    </div>}
    </div>

  );
}

function NewCategoryInput(props) {
  return(
    <div>
      {props.show ? (
      <input autoFocus onBlur={props.click} className="new-category-input align-start" placeholder="Enter name"></input>
    ) : (
      <button onClick={props.click} className="category-title align-start new-category-button pointer">
        Add Category
      </button>
    )}
    </div>
  )
}

function BoardHeader({ name }) {

  const dispatch = useDispatch();
  const [renameInput, setRenameInput] = useState(false);
  const [input, setInput] = useState(name);

  const options = [
    {name: "Rename", click: () => {setRenameInput(!renameInput); setInput(name);}},
    {name: "Delete", click: () => dispatch((deleteBoard()))}
  ];

  return(
    <div className='flex row board-header w-100'>
      {renameInput ? 
      <div className='rename flex'>
        <input className='rename-input' value={input} onChange={(e) => setInput(e.target.value)} type="text"/>
        <button onClick={() => {dispatch((renameBoard({name: input}))); setRenameInput(false);}} className='icon-button pointer'> <Check/> </button>
        <button onClick={() => setRenameInput(false)} className='icon-button pointer'> <Close/> </button>
      </div>
      : <Fragment>
      <span className='board-title text-overflow'>
        {name}
        </span>
        <OptionsDropdown icon={<Dropdown width="18" height="18"/>} options={options} />
        </Fragment>}
    </div>
  )
}