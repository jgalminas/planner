import React, { Component, useState, useEffect } from 'react';
import { ReactComponent as AddIcon } from './icons/add.svg';
import { ReactComponent as OptionsIcon } from './icons/options_v.svg';
import { Objective } from './Objective.js';
import { v4 as uuid } from 'uuid';

export function Category(props) {
  const [showForm, setShowForm] = useState(false);
    const [objectives, setObjectives] = useState(props.data.objectives);

    useEffect(() => {
        setObjectives(props.data.objectives);
    }, [props.data.objectives])

  //show new objective pop-up
  function newObjective() {
    // if (this.state.showForm) {
    //     this.setState({ showForm: false })
    // } else {
    //     this.setState({ showForm: true })
    // }
  }

  //AJAX request for creating a new objective
  async function createObjective(name) {
    // const objective = {
    //     categoryId: props.id,
    //     objectiveId: uuid(),
    //     objectiveName: name
    // }
    // //this.setState({objectives: [...this.state.objectives, objective], showForm: false});
    // await fetch('/api/objective/new', {
    //     method: 'POST',
    //     mode: 'cors',
    //     cache: 'no-cache',
    //     credentials: 'same-origin',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     },
    //     body: JSON.stringify(objective)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     const objectives = this.state.objectives;
    //         const objIndex = objectives.findIndex(obj => obj.objectiveId === objective.objectiveId);
    //         if (objIndex > -1) {
    //             objectives.splice(objIndex, 1);
    //         }
    //         this.setState({objectives: [...objectives, data]});
    //});
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
    <div>
      <div className="category p-10 h-100">
        <CategoryHeader
          delete={props.delete}
          new={newObjective}
          id={props.data.id}
          name={props.data.name}
        />
        <CategoryContent
          new={createObjective}
          showForm={showForm}
          del={deleteObjective}
          objectives={objectives}
        />
      </div>
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
      <div className="category-header flex no-wrap">
        <p className="w-auto md-title m-0"> {this.state.name} </p>
        <button
          onClick={this.props.new}
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

export function CategoryOptions(props) {
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

export class NewObjective extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  render() {
    return (
      <div className="flex wrap w-100 objective soft-shadow p-0">
        <div className="w-100 h-fit p-10">
          <input
            ref={this.input}
            className="w-100 h-fit new-objective-input"
            type="text"
            placeholder="Enter name"
          ></input>
        </div>
        <button
          autoFocus
          onClick={() => this.props.new(this.input.current.value)}
          className="new-objective-button w-100 h-fit align-end"
        >
          {' '}
          Add Task{' '}
        </button>
      </div>
    );
  }
}

export function CategoryContent(props) {
  return (
    <div className="flex col gap-15 p-10 cat-content h-100">
      {props.objectives.map((item) => {
        return <Objective key={item.id} del={props.del} data={item} />;
      })}
      {props.showForm ? <NewObjective new={props.new} /> : ''}
    </div>
  );
}
