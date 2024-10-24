import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Coach from './pages/Coach';
import Student from './pages/Student';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/student/:studentId" element={<Student />} />
          <Route path="/coach/:coachId" element={<Coach />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;