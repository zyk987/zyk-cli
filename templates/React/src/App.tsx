import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a href="https://reactjs.org/" target="_blank">
          <img src={logo} className="App-logo" alt="logo" />
        </a>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p className="App-docs">Click on the Vue logos to learn more</p>
      </header>
    </div>
  );
}

export default App;
