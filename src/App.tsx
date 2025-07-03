import { Routes, Route } from "react-router-dom";
import UploadPage from "./pages/upload";
import ResultsPage from "./pages/results";
import { PdfDataProvider } from "./context/PdfDataContext";

function App() {
  return (
    <PdfDataProvider>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </PdfDataProvider>
  );
}

export default App;
