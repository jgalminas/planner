import React, { Component } from 'react';
import { Route, Routes, Navigate } from 'react-router';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { SignUp } from './SignUp';
import { Login } from './Login';

import { AuthProvider } from './contexts/AuthContext';
import { AuthRoute, InaccessibleWhenAuthedRoute } from './AuthRoute';

import '../styles/styles.css'
import { Board } from './Board';
import { DeletedItems } from './DeletedItems';


export default class App extends Component {

  render () {
      return (
          <div className="flex row main">
            <AuthProvider>
              <Routes>
                <Route path="/:id" element={<AuthRoute><Dashboard/></AuthRoute>}>
                  <Route path='/:id' element={<Navigate to='board' replace/>}/>
                  <Route path="board" element={<AuthRoute><Board/></AuthRoute>}/>
                  <Route path="deleted-items" element={<AuthRoute> <DeletedItems/> </AuthRoute>}/>
                </Route>
                <Route path='/signup' element={ <InaccessibleWhenAuthedRoute> <SignUp/> </InaccessibleWhenAuthedRoute> }/>
                <Route path='/login' element={ <InaccessibleWhenAuthedRoute> <Login/> </InaccessibleWhenAuthedRoute> }/>
                <Route path='/' exact element={<AuthRoute><Sidebar/></AuthRoute>}/>
              </Routes>
              </AuthProvider>
          </div>
    );
  }
}





