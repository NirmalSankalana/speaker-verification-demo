import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Register from './views/register';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
