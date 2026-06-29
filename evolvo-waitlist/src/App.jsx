// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Code from "./pages/Code";
import LogIn from "./pages/LogIn";
import Onboard1 from "./pages/onboard1";
import Onboard2 from "./pages/onboard2";
import Onboard3 from "./pages/onboard3";
import Onboard4 from "./pages/onboard4";
import Onboard5 from "./pages/onboard5";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/code" element={<Code />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/onboard/1" element={<Onboard1 />} />
        <Route path="/onboard/2" element={<Onboard2 />} />
        <Route path="/onboard/3" element={<Onboard3 />} />
        <Route path="/onboard/4" element={<Onboard4 />} />
        <Route path="/onboard/5" element={<Onboard5 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
