import { useState, Fragment, useEffect, useRef } from 'react';
import { Category } from './Category';
import { Objective } from './Objective';

import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  rectIntersection,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { MouseSensor } from '../CustomSensors';

import { useSelector, useDispatch } from 'react-redux';
import { createCategory, moveCategory, moveObjective, reorderObjective, updateCategories } from './slices/currentBoardSlice';
import { DueModal } from './DueModal';

/**
 * The component that holds all of the board content, such as categories and tasks.
 */
export function Board() {

  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  
  const [activeId, setActiveId] = useState();
  const [activeType, setActiveType] = useState();

  const currentBoard = useSelector((state) => state.currentBoard.value);
  const dispatch = useDispatch();

  // state for items that the user will be notified about if they are due that day
  const [notify, setNotify] = useState(false);
  const [notifyItems, setNotifyItems] = useState([]);

  const activationConstraint = {
    distance: 15
  }

  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint }));

  // Notification
  useEffect(() => {

    if (currentBoard.boardId) {
    
    // Checks if the notification has been showed by checking session storage where
    // a boolean variable is stored.
    if (!sessionStorage.getItem(`${currentBoard.boardId}-notified`)) {

      const today = new Date().toDateString();
      const items = [];
  
      // checks if categories are due today
      currentBoard?.categories?.forEach((cat) => {
        items.push(...cat.objectives.filter((obj) => new Date(obj.dueDate).toDateString() === today));
      })

      // if there are categories due today, set pop-up state to true
      if (items.length > 0) {
        setNotifyItems(items);
        setNotify(true);
      }

      // set session storage variable to true
      sessionStorage.setItem(`${currentBoard.boardId}-notified`, true);

      }
    }

  }, [currentBoard?.boardId])

  if (!currentBoard.boardId) {
    return null;
  }

  function newCategoryInput({current: ref}) {

    if (ref) {
      if ((ref.value.trim() === '') || undefined) {
        setShowNewCategoryInput(false);
      } else {
        dispatch(createCategory({name: ref.value.trim()}))
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
    <Fragment>

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

    {notify && <DueModal items={notifyItems} close={() => setNotify(false)}/> }

    </div>}
    </Fragment>

  );
}

function NewCategoryInput(props) {

  const input = useRef();

  return(
    <div>
      <form onSubmit={(e) => { e.preventDefault(); props.click(input);}}>
      {props.show ? (
        <input ref={input} autoFocus onBlur={() => props.click(input)} className="new-category-input align-start" placeholder="Enter name"></input>
      ) : (
      <button onClick={() => props.click(input)} className="align-start new-category-button pointer">
        Add Category
      </button>
    )}
      </form>
    </div>
  )
}
