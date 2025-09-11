import './App.css';
import Navbar from './components/navbar/navbar';
import Home from './pages/home/home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login, Register, Logout, Edit, Delete } from './pages/account';
import Send from './pages/send/send';
import Check from './pages/check/check';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
        <BrowserRouter>
          <Routes>
            <Route index element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/logout" element={<Logout/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/edit" element={<Edit/>} />
            <Route path="/delete" element={<Delete/>} />
            <Route path="/check" element={<Check/>} />
            <Route path="/send" element={<Send/>} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
