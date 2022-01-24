import React, { Component, useState, useEffect, useRef } from 'react';
import { ReactComponent as AddIcon } from './icons/add.svg';
import { ReactComponent as OptionsIcon } from './icons/options_v.svg';
import { Objective } from './Objective.js';
import { v4 as uuid } from 'uuid';

export function Category(props) {
  const [showForm, setShowForm] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  function showNewObjectiveInput() {
    if (showForm) {
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  }

  function openOptions(event) {
    if (event.relatedTarget instanceof HTMLButtonElement) {
    } else if (event.type === 'blur') {
      setShowOptions(false);
    } else {
      if (showOptions) {
        setShowOptions(false);
      } else {
        setShowOptions(true);
      }
    }
  }

  return (
  <div className="category h-100">
        <CategoryHeader delete={props.delete} showOptions={openOptions} show={showNewObjectiveInput} id={props.data.id} name={props.data.name}>
          <CategoryOptions visibility={showOptions} delete={props.delete} id={props.data.id}/>
        </CategoryHeader>

        <div className="flex col gap-15 p-10 cat-content">
        {props.data.objectives.map((item) => {
        return <Objective catId={props.data.id} key={item.id} delete={props.deleteObjective} data={item} />;
        })}
        <NewObjectiveInput visibility={showForm} catId={props.data.id} show={showNewObjectiveInput} new={props.createObjective}/>
        </div>

        {props.children}
      </div>
  );
}

//Category header component which is rendered at the top of the category container
export function CategoryHeader(props) {

  return (
    <div className="category-header p-10 flex row no-wrap">
      <p className="w-auto md-title m-0"> {props.name} </p>
      <button onClick={props.show} className="icon-button align-right w-auto">
        <AddIcon className="pointer" stroke="#4B4B4B" />
      </button>
      <button onBlur={props.showOptions} onClick={props.showOptions} className="icon-button w-auto">
        <OptionsIcon />
      </button>
      {props.children}
    </div>
  );
}

//Category options component which is rendered within the category header container
export function CategoryOptions(props) {

  return (
    (props.visibility) ?
    <div className="flex col no-wrap w-fit h-fit category-options">
      <button className="category-options-item m-0"> Rename </button>
      <button onClick={() => props.delete(props.id)} className="category-options-item m-0"> Delete </button>
    </div>
    : null
  );
}

export function NewObjectiveInput(props) {
  const input = useRef();

  return (
    (props.visibility) ? 
    <div className="flex wrap w-100 objective soft-shadow p-0">
      <div className="w-100 h-fit p-10">
        <input
          ref={input}
          className="w-auto h-fit new-objective-input"
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
    : null
  )
}