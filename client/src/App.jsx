import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import DataProvider from "./data/DataProvider.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Dataset from "./pages/Dataset.jsx";
import Preprocessing from "./pages/Preprocessing.jsx";
import Eda from "./pages/Eda.jsx";
import Statistics from "./pages/Statistics.jsx";
import Visualizations from "./pages/Visualizations.jsx";
import Findings from "./pages/Findings.jsx";
import NotFound from "./pages/NotFound.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
      <DataProvider>
        <ScrollToTop />
        <Navbar />
        <main className="container page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dataset" element={<Dataset />} />
            <Route path="/preprocessing" element={<Preprocessing />} />
            <Route path="/eda" element={<Eda />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/visualizations" element={<Visualizations />} />
            <Route path="/findings" element={<Findings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </DataProvider>
  );
}