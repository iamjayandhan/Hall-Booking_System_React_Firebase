import React from 'react';
import HallUploader from './HallUploader'; // Import your HallUploader component
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hall Data Upload</h1>
      </header>
      <main>
        <HallUploader />
      </main>
    </div>
  );
}

export default App;
