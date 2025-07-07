import { PdfDataProvider } from "./context/PdfDataContext";
import AppRoutes from "./routes";

function App() {
  return (
    <PdfDataProvider>
      <AppRoutes />
    </PdfDataProvider>
  );
}

export default App;
