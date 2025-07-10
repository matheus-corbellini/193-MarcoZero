import React, { createContext, useContext, useState } from "react";

export interface PdfData {
  fileName?: string;
  extractedDate?: string;
  autoNumber?: string;
  numero_auto_infracao?: string;
  taxpayer?: {
    name?: string;
    cnpj?: string;
    ie?: string;
  };
  infraction?: {
    description?: string;
    article?: string;
    penalty?: string;
    fine?: string;
    total?: string;
    aliquota_aplicada?: string;
    aliquota_correta?: string;
    base_calculo_presumida?: string;
    valor_lancado?: string;
    valor_devido?: string;
    juros_multa?: string;
    erro_mva_st_dec?: string;
    diferenca_cobrada_maior?: string;
  };
  dueDate?: string;
  status?: string;
  ocrText?: string;
  validationErrors?: string[];
}

interface PdfDataContextType {
  pdfData: PdfData | null;
  setPdfData: (data: PdfData | null) => void;
}

const PdfDataContext = createContext<PdfDataContextType | undefined>(undefined);

export const PdfDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pdfData, setPdfData] = useState<PdfData | null>(null);
  return (
    <PdfDataContext.Provider value={{ pdfData, setPdfData }}>
      {children}
    </PdfDataContext.Provider>
  );
};

export function usePdfData() {
  const context = useContext(PdfDataContext);
  if (!context) {
    throw new Error("usePdfData deve ser usado dentro de PdfDataProvider");
  }
  return context;
}
