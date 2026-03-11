import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "./components/ui/toaster";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Share from "./pages/Share";
import Download from "./pages/Download";
import ErrorPage from "./pages/Error";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/share/:fileId" element={<Share />} />
        <Route path="/download/:fileId" element={<Download />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
