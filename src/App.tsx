import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Landing from "./Pages/Landing";
import Login from "./Pages/Login";

function App() {
  return (
    <div className="home">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
