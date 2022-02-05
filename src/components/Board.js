import { useState, useEffect } from 'react';
import { Category } from './Category';
import { OptionsDropdown } from './OptionsDropdown';
import { ReactComponent as Dropdown } from './icons/dropdown.svg'
import { useData } from './contexts/DataContext';
import { useGlobalState } from 'state-pool';


export function Board(props) {

  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [currentBoard] = useGlobalState("currentBoard");
  const dataContext = useData();

  // Everything inside this useEffect is called when the component mounts and each time the board ID changes.
  useEffect(() => {
    dataContext.populateCurrentBoard(props.location.dataId, props.location.name, props.location.boardId);
  }, [props.location.boardId]);

  //Clean this up a bit
  function newCategoryInput(event) {
    if (event.target instanceof HTMLInputElement) {
      if ((event.target.value.trim() === '') || undefined) {
        setShowNewCategoryInput(false);
      } else {
        dataContext.createCategory(event.target.value.trim());
        setShowNewCategoryInput(false);
      }
    } else {
      setShowNewCategoryInput(true);
    }
  }

  return (
    <div className='h-100 board'>
      <BoardHeader {...currentBoard}/>
    <div className="flex row no-wrap gap-15 board-content">
      {(currentBoard.categories) ? currentBoard.categories.map((data) => {
        return (
          <Category key={data.id} {...data}/>
        );
      }) : null}
      <NewCategoryInput show={showNewCategoryInput} click={newCategoryInput}/>
    </div>
    </div>
  );
}

function NewCategoryInput(props) {
  return(
    <div>
      {props.show ? (
      <input autoFocus onBlur={props.click} className="new-category-input align-start" placeholder="Enter name"></input>
    ) : (
      <button onClick={props.click} className="md-title align-start new-category-button pointer">
        Add Category
      </button>
    )}
    </div>
  )
}

function BoardHeader(props) {

  const dataContext = useData();

  const options = [
    {name: "Delete", click: () => dataContext.deleteBoard()}
  ];

  return(
    <div className='flex row board-header w-100'>
      <span className='board-title text-overflow'>
        {props.name}
      </span>
        <OptionsDropdown icon={<Dropdown/>} options={options} />
    </div>
  )
}