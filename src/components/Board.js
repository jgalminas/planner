import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from './Category';
import { v4 as uuid } from 'uuid';
import { doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { ReactComponent as OptionsIcon } from './icons/options_h.svg';
import { OptionsDropdown } from './OptionsDropdown';

import { ReactComponent as Dropdown } from './icons/dropdown.svg'
import { DatePicker } from './DatePicker';

export function Board(props) {

  const [data, setData] = useState({name: "", categories: []});
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const navigate = useNavigate();

  // Everything inside this useEffect is called when the component mounts and each time the board ID changes.
  useEffect(() => {
    populateData();
  }, [props.board.boardId]);

  function populateData() {

    const unsubscribe = onSnapshot(doc(db, "boardData", props.board.dataId), (doc) => {
      setData({id: doc.id, ...doc.data()});
  }, () => {
    navigate("/");
  });

    return unsubscribe;
  }

  function deleteBoard(boardId, boardDataId) {
    deleteDoc(doc(db, 'boardData', boardDataId)).then(() => {
      deleteDoc(doc(db, 'boards', boardId))
    })
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
      <BoardHeader data={props.board} delete={deleteBoard}/>
    <div className="flex row no-wrap gap-15 board-content">
      {(data.categories) ? data.categories.map((item) => {
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
      <button onClick={props.click} className="md-title align-start new-category-button">
        Add Category
      </button>
    )}
    </div>
  )
}

function BoardHeader(props) {

  const options = [
    {name: "Delete", click: () => props.delete(props.data.boardId, props.data.dataId)}
  ];

  return(
    <div className='flex row board-header w-100'>
      <span className='board-title text-overflow'>
        {props.data.name}
      </span>
        <OptionsDropdown icon={<Dropdown/>} options={options} />
    </div>
  )
}