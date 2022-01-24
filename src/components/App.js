import React, { Component } from 'react';
import { Route, Routes} from 'react-router';

import { Sidebar } from './Sidebar';
import { Board } from './Board';
import { SignUp } from './SignUp';

import { AuthProvider } from './contexts/AuthContext';

import './custom.css'

export default class App extends Component {

  render () {
      return (
          <div className="flex row main">
            <AuthProvider>
              <Routes>
                <Route path='/signup' element={<SignUp/>}/>
              </Routes>
              {/* <Sidebar />
              <Routes>
                  <Route path="/board/:id" element={<Board/>}/>
              </Routes> */}
              </AuthProvider>
          </div>
    );
  }
}





