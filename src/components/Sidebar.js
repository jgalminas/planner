import React, { useState, useEffect, Component } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as AddIcon } from './icons/add.svg';


import { collection, getDocs } from 'firebase/firestore';
import { db } from './App.js';


export class Sidebar extends Component {
  static displayName = Sidebar.name;

  constructor(props) {
    super(props);
    this.state = { data: [], new: false };
    this.newBoard = this.newBoard.bind(this);
    this.createBoard = this.createBoard.bind(this);
  }

  componentDidMount() {
    this.populateData();
  }

  async populateData() {

    const colRef = collection(db, 'boards');

    getDocs(colRef).then((snapshot) => {
      const boards = snapshot.docs.map((doc) => {
        return ({ id: doc.id, ...doc.data() }
      )});
      this.setState({ data: boards });
    });
  }

  // parameters in the passed object must start with lower case
  async createBoard(name) {
    const request = await fetch('/api/board/new', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        boardName: name,
      }),
    });

    const response = await request.json();

    if (request.ok) {
      this.setState({ data: [...this.state.data, response], new: false });
    }
  }

  newBoard() {
    if (this.state.new) {
      this.setState({ new: false });
    } else {
      this.setState({ new: true });
    }
  }

  render() {
    return (
      <aside className="sidebar">
        <BoardOptions newBoard={this.newBoard} />
        {this.state.new ? <NewBoard new={this.createBoard} /> : ''}
        <BoardList data={this.state.data} />
      </aside>
    );
  }
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
    <Link className="flex row board-item" to={`/board/${props.data.id}`}>
      <div className="board-item-icon">
        {props.data.name.charAt(0).toUpperCase()}
      </div>
      <div className="align-center white light"> {props.data.name} </div>
    </Link>
  );
}

export class NewBoard extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  render() {
    return (
      <div className="flex col no-wrap p-10 gap-15">
        <input
          ref={this.input}
          className="h-fit new-board-input w-auto"
          type="text"
          placeholder="Enter name"
        ></input>
        <button
          className="new-board-button white w-100"
          autoFocus
          onClick={() => this.props.new(this.input.current.value)}
        >
          Create Board
        </button>
      </div>
    );
  }
}
