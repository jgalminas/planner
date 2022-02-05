import React, { Component } from 'react';
import { Route, Routes} from 'react-router';

import { Dashboard } from './Dashboard';
import { SignUp } from './SignUp';
import { Login } from './Login';

import { AuthProvider } from './contexts/AuthContext';
import { AuthRoute, InaccessibleWhenAuthedRoute } from './AuthRoute';
import { DataProvider } from './contexts/DataContext';

import './custom.css'

export default class App extends Component {

  render () {
      return (
          <div className="flex row main">
            <AuthProvider>
              <Routes>
                <Route path="/:id" element={<AuthRoute><DataProvider><Dashboard/></DataProvider></AuthRoute>}/>
                <Route path='/signup' element={ <InaccessibleWhenAuthedRoute> <SignUp/> </InaccessibleWhenAuthedRoute> }/>
                <Route path='/login' element={ <InaccessibleWhenAuthedRoute> <Login/> </InaccessibleWhenAuthedRoute> }/>
                <Route path='/' exact element={<AuthRoute><DataProvider><Dashboard/></DataProvider></AuthRoute>}/>
              </Routes>
              </AuthProvider>
          </div>
    );
  }
}





