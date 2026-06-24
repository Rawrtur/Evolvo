// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Code from "./pages/Code";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/code" element={<Code />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;