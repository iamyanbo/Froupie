import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Map from './Components/Map';
import cors from 'cors';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Map />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
