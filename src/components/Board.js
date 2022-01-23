import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

import { Category } from './Category';
import { v4 as uuid } from 'uuid';

import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from './App.js';

export function Board() {

  const { state } = useLocation();
  const [data, setData] = useState({name: "", categories: []});
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // Everything inside this useEffect is called when the component mounts and each time the board ID changes.
  useEffect(() => {
    populateData();
  }, [state.boardId]);

  function populateData() {

    onSnapshot(doc(db, "boardData", state.dataId), (doc) => {
      setData({id: doc.id, ...doc.data()});
  });
  }

  function createObjective(name, catId) {

    const it = data.categories.findIndex((cat) => cat.id === catId);

    const categories = [...data.categories];
    categories[it].objectives.push({id: uuid(), name: name});

    updateDoc(doc(db, 'boardData', state.dataId), {categories});
  }

  function createCategory(name) {

    const categories = [...data.categories];
    categories.push({id: uuid(), name: name, objectives: []});

    updateDoc(doc(db, 'boardData', state.dataId), {categories});

  }

  function deleteCategory(catId) {

    const it = data.categories.findIndex((cat) => cat.id === catId);
    const categories = [...data.categories];

    if (it > -1) {
      categories.splice(it, 1);
    }

    updateDoc(doc(db, 'boardData', state.dataId), {categories});

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
    <div className="flex row no-wrap gap-15 board h-100">
      {data.categories.map((item) => {
        return (
          <Category key={item.id} delete={deleteCategory} createObjective={createObjective} board={state.boardId} dataId={state.dataId} data={item}/>
        );
      })}
      <NewCategoryInput show={showNewCategoryInput} click={newCategoryInput}/>
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