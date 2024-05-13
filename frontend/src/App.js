import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Register from './views/register';
import Verify from './views/home';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Verify />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
