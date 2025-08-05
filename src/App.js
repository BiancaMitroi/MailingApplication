import './App.css';
import Navbar from './components/navbar/navbar';
import Home from './pages/home/home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login, Register } from './pages/account';
import Send from './pages/send/send';
import Check from './pages/check/check';
import Status from './components/error/status';

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
            <Route path="/check" element={<Check/>} />
            <Route path="/send" element={<Send/>} />
            <Route path="/status" element={<Status />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
