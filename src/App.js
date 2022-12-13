import './App.css';
import './assets/css/index.css'
import './assets/css/idle.css'
import './assets/css/home.css'
import 'bootstrap/dist/css/bootstrap.css'
import React, {useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Home from './components/home/Home'
import Admin from './components/admin/Home'
function App() {
  //window. oncontextmenu = function(event) { event. preventDefault(); event. stopPropagation(); return false; };

 

  return (
    <div className="App">
        <Router>
          <Routes>
              <Route
                path="/"
                element={ <Home /> }
              /> 
                <Route
                path="/admin"
                element={ <Admin /> }
              /> 
          </Routes>
        </Router>
    </div>
  );
}

export default App;
