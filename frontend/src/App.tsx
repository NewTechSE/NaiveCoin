import React from 'react';
import './App.css';
import { HomePage } from './pages/home-page';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />}>
        
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
