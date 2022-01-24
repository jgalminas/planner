import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as AddIcon } from './icons/add.svg';


import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebase';


export function Sidebar() {

  const [data, setData] = useState([]);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    populateData();
  }, [])

  function populateData() {
    
    onSnapshot(collection(db, 'boards'), (col) => {
      const boards = col.docs.map((doc) => {
        return {id: doc.id, ...doc.data()}
      })
      setData([...boards]);
    });

  }

  function toggleInput() {
    if (showInput) {
      setShowInput(false);
    } else {
      setShowInput(true);
    }
  }

  function createBoard(name) {

    addDoc(collection(db, 'boardData'), {categories: []}).then((doc) => {
      addDoc(collection(db, 'boards'), {name: name, data: doc.id})
    })
  }

  

  return (
    <aside className="sidebar">
      <BoardOptions newBoard={toggleInput}/>
      {showInput ? <NewBoardInput new={createBoard} /> : null}
      <BoardList data={data}/>
    </aside>
  );
}

function BoardOptions(props) {
  return (
    <div className="flex row no-wrap w-100 p-10">
      <h1 className="md-title white w-fit m-0">Your Boards</h1>
      <button className="w-fit" type="submit" onClick={props.newBoard}>
        <AddIcon stroke="#ffffff" />
      </button>
    </div>
  );
}

function BoardList(props) {

  return (
    <div className="flex col">
      {props.data.map((item) => {
        return <BoardItem key={item.id} data={item}/>
      })}
    </div>
  );
}

function BoardItem(props) {

  return (
    <Link className="flex row board-item" state={{name: props.data.name, boardId: props.data.id, dataId: props.data.data}} to={`/board/${props.data.id}`}>
      <div className="board-item-icon">
        {props.data.name.charAt(0).toUpperCase()}
      </div>
      <div className="align-center white light"> {props.data.name} </div>
    </Link>
  );
}

export function NewBoardInput(props) {

  const input = useRef();

  return (
    <div className="flex col no-wrap p-10 gap-15">
      <input
        ref={input}
        className="h-fit new-board-input w-auto"
        type="text"
        placeholder="Enter name"
      ></input>
      <button
        className="new-board-button white w-100"
        autoFocus
        onClick={() => props.new(input.current.value)}
      >
        Create Board
      </button>
    </div>
  );
}
