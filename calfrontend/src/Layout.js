import React from 'react';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <header>
        <h1>Scheduler App</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/coach/1">Example Coach</a></li>
            <li><a href="/student/1">Example Student</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;