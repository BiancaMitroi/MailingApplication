import './App.css';
import Navbar from './components/navbar/navbar';
import Home from './pages/home/home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login, Register } from './pages/account';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
        <BrowserRouter>
          <Routes>
            <Route index element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
