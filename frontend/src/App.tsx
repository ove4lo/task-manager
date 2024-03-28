import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

import MainPage from './pages/MainPage';
import TaskCreatePage from './pages/TaskCreatePage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import TaskEditPage from './pages/TaskEditPage';

function App() {
  return (
    <Router>
      <div className="container mx-auto pt-4">
        <Routes>
          <Route path={'/'} element={<MainPage/>} />
          <Route path={'/add'} element={<TaskCreatePage />} />
          <Route path={'/task/:id'} element={<TaskDetailsPage />} />
          <Route path={'/edit/:id'} element={<TaskEditPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
