import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.new";
import { ThemeProvider } from "./components/ThemeProvider";

import Home from "./pages/Home";
import About from "./pages/About";
import Sponser from "./pages/Sponser";
import Admin from "./pages/Admin";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/sponser" element={<Sponser />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
