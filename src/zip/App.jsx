import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { useState } from 'react'
import Main from "./pages/Main"
import DetailPage from "./pages/DetailPage"
import DetailItem from "./component/DetailItem";

import './App.css'

function App() {

  return (
    <>
       <Router>
        <div className='wrapper'>
          <div className='container-wrap'>
            <Routes>  
              <Route path='/' element={<Main />} />
              <Route path="/detail/:id" element={<DetailPage  />} /> 
            </Routes>
          </div>
        </div>
      </Router>
    </>
  )
}

export default App
