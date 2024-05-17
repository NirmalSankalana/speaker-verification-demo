import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Register from './views/register';
import Verify from './views/home';
import Success from './views/sucess';
import NotMatch from './views/notmatch';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Verify />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/not-match" element={<NotMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
