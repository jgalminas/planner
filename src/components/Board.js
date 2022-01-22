import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import { Category } from './Category';
import { v4 as uuid } from 'uuid';

import { ReactComponent as AddIcon } from './icons/add.svg';

import { collection, getDocs } from 'firebase/firestore';
import { db } from './App.js';

export function Board() {
  const { id } = useParams();
  const [data, setData] = useState({name: "", categories: []});
  const [newCat, setNewCat] = useState(false);

  useEffect(() => {
    populateData();
  }, [id]);

  async function populateData() {

    getDocs(collection(db, 'boards', id, 'data')).then((snapshot) => {
      const items = snapshot.docs.map((doc) => {
        return {id: doc.id, ...doc.data()}
      })
      setData({...items[0]});
    })
    
  }

  async function createCategory(name) {
    const category = {
      boardId: this.state.id,
      categoryId: uuid(),
      categoryName: name,
      objectives: [],
    };

    this.setState({ categories: [...this.state.categories, category] });

    const request = await fetch('/api/category/new', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(category),
    })
      .then((response) => response.json())
      .then((data) => {
        const categories = this.state.categories;
        const catIndex = categories.findIndex(
          (obj) => obj.categoryId === category.categoryId
        );

        if (catIndex > -1) {
          categories.splice(catIndex, 1);
        }

        this.setState({ categories: [...categories, data] });
      });
  }

  async function deleteCategory(catId) {
    const it = this.state.categories.findIndex(
      (cat) => cat.categoryId === catId
    );
    const categories = this.state.categories;

    if (it > -1) {
      categories.splice(it, 1);
    }

    this.setState({ categories: categories });

    await fetch(`/api/category/delete?id=${catId}`);
  }

  function addCategory(event) {
    if (event.target instanceof HTMLInputElement) {
      if ((event.target.value.trim() === '') | undefined) {
        setNewCat(false);
      } else {
        createCategory(event.target.value.trim());
        setNewCat(false);
      }
    } else {
      setNewCat(true);
    }
  }

  return (
    <div className="flex row no-wrap gap-15 board h-100">
      {data.categories.map((item) => {
        return (
          <Category
            key={item.id}
            delete={deleteCategory}
            board={id}
            data={item}
          />
        );
      })}

      {newCat ? (
        <input
          autoFocus
          onBlur={addCategory}
          className="new-category-input align-start"
          placeholder="Enter name"
        ></input>
      ) : (
        <button
          onClick={addCategory}
          className="md-title align-start new-category-button"
        >
          Add Category
        </button>
      )}
    </div>
  );
}
