import { useContext } from "react";
import { PdfDataContext } from "../context/PdfDataContext";

export function usePdfData() {
  const context = useContext(PdfDataContext);
  if (!context) {
    throw new Error("usePdfData deve ser usado dentro de PdfDataProvider");
  }
  return context;
}
