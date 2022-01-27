import { useState, useEffect } from 'react';
import { Category } from './Category';
import { v4 as uuid } from 'uuid';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { ReactComponent as OptionsIcon } from './icons/options_h.svg';
import { OptionsDropdown } from './OptionsDropdown';

export function Board(props) {

  const [data, setData] = useState({name: "", categories: []});
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // Everything inside this useEffect is called when the component mounts and each time the board ID changes.
  useEffect(() => {
    populateData();
  }, [props.board.boardId]);

  function populateData() {

    onSnapshot(doc(db, "boardData", props.board.dataId), (doc) => {
      setData({id: doc.id, ...doc.data()});
  });
  }

  function createObjective(name, catId) {

    const it = data.categories.findIndex((cat) => cat.id === catId);

    const categories = [...data.categories];
    categories[it].objectives.push({id: uuid(), name: name});

    updateDoc(doc(db, 'boardData', props.board.dataId), {categories});
  }

  function deleteObjective(objId, catId) {

    const categories = [...data.categories];
    const categoryItem = categories.findIndex((cat) => cat.id === catId);

    const objectives = categories[categoryItem].objectives;
    const objectiveItem = objectives.findIndex(obj => obj.id === objId);


    if (objectiveItem > -1) {
        objectives.splice(objectiveItem, 1);
    }

    categories[categoryItem].objectives = objectives;
    updateDoc(doc(db, 'boardData', props.board.dataId), {categories});

  }

  function createCategory(name) {

    const categories = [...data.categories];
    categories.push({id: uuid(), name: name, objectives: []});

    updateDoc(doc(db, 'boardData', props.board.dataId), {categories});

  }

  function deleteCategory(catId) {

    const it = data.categories.findIndex((cat) => cat.id === catId);
    const categories = [...data.categories];

    if (it > -1) {
      categories.splice(it, 1);
    }

    updateDoc(doc(db, 'boardData', props.board.dataId), {categories});

  }

  //Clean this up a bit
  function newCategoryInput(event) {
    if (event.target instanceof HTMLInputElement) {
      if ((event.target.value.trim() === '') || undefined) {
        setShowNewCategoryInput(false);
      } else {
        createCategory(event.target.value.trim());
        setShowNewCategoryInput(false);
      }
    } else {
      setShowNewCategoryInput(true);
    }
  }

  return (
    <div className='h-100 board'>
      <BoardHeader name={props.board.name}/>
    <div className="flex row no-wrap gap-15 board-content">
      {data.categories.map((item) => {
        return (
          <Category
          key={item.id}
          delete={deleteCategory}
          createObjective={createObjective}
          deleteObjective={deleteObjective}
          board={props.board.boardId}
          dataId={props.board.dataId}
          data={item}
          />
        );
      })}
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
      <button onClick={props.click} className="md-title align-start new-category-button">
        Add Category
      </button>
    )}
    </div>
  )
}

function BoardHeader(props) {

  return(
    <div className='flex row board-header w-100'>
      <p className='h-100 board-title'>
        {props.name}
      </p>
      <OptionsDropdown>
        <button className='category-options-item m-0' onClick={() => props.delete(props.dataId, props.boardId)}> Delete </button>
        </OptionsDropdown>
    </div>
  )
}