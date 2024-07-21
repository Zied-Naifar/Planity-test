import React from 'react';
import logo from './logo.svg';
import './App.css';


//* Data
import {events} from "./input";
import Calendar from './components/Calendar/Calendar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Calendar events={events} />
      </header>
    </div>
  );
}


export default App;
