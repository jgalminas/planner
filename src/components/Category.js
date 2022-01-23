import React, { Component, useState, useEffect, useRef } from 'react';
import { ReactComponent as AddIcon } from './icons/add.svg';
import { ReactComponent as OptionsIcon } from './icons/options_v.svg';
import { Objective } from './Objective.js';
import { v4 as uuid } from 'uuid';

export function Category(props) {
  const [showForm, setShowForm] = useState(false);

  function showNewObjectiveInput() {
    if (showForm) {
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  }

  async function deleteObjective(id) {
    // const it = this.state.objectives.findIndex(obj => obj.objectiveId === id);
    // const objectives = this.state.objectives;
    // if (it > -1) {
    //     objectives.splice(it, 1);
    // }
    // this.setState({ objectives: objectives });
    // await fetch(`/api/objective/delete?id=${id}`);
  }

  return (
  <div className="category h-100">
        <CategoryHeader delete={props.delete} show={showNewObjectiveInput} id={props.data.id} name={props.data.name}/>
        <CategoryContent visibility={showForm} show={showNewObjectiveInput} id={props.data.id} del={deleteObjective} objectives={props.data.objectives}> 
        <NewObjectiveInput visibility={showForm} catId={props.data.id} show={showNewObjectiveInput} new={props.createObjective}/>
        </CategoryContent>
      </div>
  );
}

export class CategoryHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { id: this.props.id, name: this.props.name, options: false };
    this.openOptions = this.openOptions.bind(this);
  }

  openOptions(event) {
    if (event.relatedTarget instanceof HTMLButtonElement) {
    } else if (event.type === 'blur') {
      this.setState({ options: false });
    } else {
      if (this.state.options) {
        this.setState({ options: false });
      } else {
        this.setState({ options: true });
      }
    }
  }

  render() {
    return (
      <div className="category-header p-10 flex row no-wrap">
        <p className="w-auto md-title m-0"> {this.state.name} </p>
        <button
          onClick={this.props.show}
          className="icon-button align-right w-auto"
        >
          <AddIcon stroke="#4B4B4B" />
        </button>
        <button
          onBlur={this.openOptions}
          onClick={this.openOptions}
          className="icon-button w-auto"
        >
          <OptionsIcon />
        </button>
        {this.state.options ? (
          <CategoryOptions delete={this.props.delete} id={this.state.id} />
        ) : null}
      </div>
    );
  }
}

function CategoryOptions(props) {
  const [id] = useState(props.id);

  return (
    <div className="flex col no-wrap w-fit h-fit category-options">
      <button className="category-options-item m-0"> Rename </button>
      <button
        onClick={() => props.delete(id)}
        className="category-options-item m-0"
      >
        {' '}
        Delete{' '}
      </button>
    </div>
  );
}

function NewObjectiveInput(props) {
  const input = useRef();

  return (
    <div> {(props.visibility) ? 
    <div className="flex wrap w-100 objective soft-shadow p-0">
      <div className="w-100 h-fit">
        <input
          ref={input}
          className="w-100 h-fit new-objective-input"
          type="text"
          placeholder="Enter name"
        ></input>
      </div>
      <button
        autoFocus
        onClick={() => {
          props.new(input.current.value, props.catId);
          props.show()
        }}
        className="new-objective-button w-100 h-fit align-end"
      >
        Add Task
      </button>
    </div>
    : null }</div>
  )
}

function CategoryContent(props) {
  return (
    <div className="flex col gap-15 p-10 cat-content">
      {props.objectives.map((item) => {
        return <Objective key={item.id} del={props.del} data={item} />;
      })}
      {props.children}
    </div>
  );
}
