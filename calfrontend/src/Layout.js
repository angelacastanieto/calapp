import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => (
  <div>
    <header>
      <h1>Scheduler App</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/user/1">Example Coach</a></li>
          <li><a href="/user/2">Example Student</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <Outlet />
    </main>
  </div>
)


export default Layout;