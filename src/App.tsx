import React from 'react';
import NavBar from './components/NavBar';
import {RouterMain} from './components/RouterMain';
import SideNav from './components/SideNav';
function App() {
  return (
    <>
      <SideNav/>
      <header>
        <NavBar/>
      </header>
      <main>
        <RouterMain/>
      </main>
    </>
  );
}

export default App;
