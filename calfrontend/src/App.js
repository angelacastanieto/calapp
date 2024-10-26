import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './Layout';
import Home from './pages/Home';
import User from './pages/User';
import { ErrorBoundary } from './ErrorBoundary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"
          element={<Layout />}
          errorElement={<ErrorBoundary />}
        >
          <Route index element={<Home />} />
          <Route path="/users/:userId" element={<User />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;