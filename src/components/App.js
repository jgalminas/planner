import React, { Component } from 'react';
import { Route, Routes} from 'react-router';

import { Dashboard } from './Dashboard';
import { SignUp } from './SignUp';
import { Login } from './Login';

import { AuthProvider } from './contexts/AuthContext';
import { AuthRoute, InaccessibleWhenAuthedRoute } from './AuthRoute';

import '../styles/styles.css'
import './custom.css'


export default class App extends Component {

  render () {
      return (
          <div className="flex row main">
            <AuthProvider>
              <Routes>
                <Route path="/:id" element={<AuthRoute><Dashboard/></AuthRoute>}/>
                <Route path='/signup' element={ <InaccessibleWhenAuthedRoute> <SignUp/> </InaccessibleWhenAuthedRoute> }/>
                <Route path='/login' element={ <InaccessibleWhenAuthedRoute> <Login/> </InaccessibleWhenAuthedRoute> }/>
                <Route path='/' exact element={<AuthRoute><Dashboard/></AuthRoute>}/>
              </Routes>
              </AuthProvider>
          </div>
    );
  }
}





