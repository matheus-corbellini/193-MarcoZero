"use client";

import type React from "react";
import { useState } from "react";
import "../styles/uploadPage.css";

interface ExtractedInfo {
  numeroProcesso?: string;
  nomeContribuinte?: string;
  cnpjContribuinte?: string;
  confianca?: number;
}

export default function HunterFiscal() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo>({});

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setOcrText("");
    setOcrProgress(0);
    setIsProcessing(true);

    try {
      // Usar a nova API Python com SpaCy
      await processWithPythonAPI(file);
    } catch (err) {
      setOcrText("Erro ao processar arquivo: " + err);
    }
    setIsProcessing(false);
  };

  const processWithPythonAPI = async (file: File) => {
    try {
      setOcrProgress(10);

      const formData = new FormData();
      formData.append("file", file);

      setOcrProgress(30);

      const response = await fetch("http://localhost:8000/extract-info", {
        method: "POST",
        body: formData,
      });

      setOcrProgress(70);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setOcrProgress(100);

      // Atualizar texto extraído
      setOcrText(result.texto_extraido || "Texto não extraído");

      // Atualizar informações extraídas
      setExtractedInfo({
        numeroProcesso: result.numero_processo,
        nomeContribuinte: result.nome_contribuinte,
        cnpjContribuinte: result.cnpj_contribuinte,
        confianca: result.confianca,
      });
    } catch (err) {
      console.error("Erro ao processar com API Python:", err);
      throw new Error(`Erro ao processar arquivo: ${err}`);
    }
  };

  const triggerFileSelect = () => {
    if (!isProcessing) {
      document.getElementById("file-upload")?.click();
    }
  };

  return (
    <div className="upload-full-bg">
      <div className="upload-full-content">
        <h1 className="title">Hunter Fiscal</h1>
        <div className="uploadSection">
          <div className="uploadIcon">
            <svg
              className="arrowUp"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </div>
          <input
            type="file"
            id="file-upload"
            className="fileInput"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
          />
          <button
            className="uploadButton"
            onClick={triggerFileSelect}
            disabled={isProcessing}
          >
            {isProcessing
              ? `Processando... ${ocrProgress}%`
              : selectedFile
              ? "ARQUIVO SELECIONADO"
              : "ESCOLHER ARQUIVO"}
          </button>
          <p className="description">
            {selectedFile
              ? `Arquivo selecionado: ${selectedFile.name}`
              : "Faça o upload do Auto de Infração ICMS em PDF ou img"}
          </p>

          {ocrText && (
            <div
              style={{
                marginTop: "2rem",
                color: "#fff",
                background: "#222",
                padding: "1rem",
                borderRadius: "0.5rem",
                maxHeight: 300,
                overflow: "auto",
              }}
            >
              <strong>Texto reconhecido:</strong>
              <pre style={{ whiteSpace: "pre-wrap" }}>{ocrText}</pre>

              <div style={{ marginTop: "1rem", color: "#f97316" }}>
                <strong>Extração com SpaCy:</strong>
                <div>
                  Número do Processo:{" "}
                  {extractedInfo.numeroProcesso || "Não encontrado"}
                </div>
                <div>
                  Nome do Contribuinte:{" "}
                  {extractedInfo.nomeContribuinte || "Não encontrado"}
                </div>
                <div>
                  CNPJ do Contribuinte:{" "}
                  {extractedInfo.cnpjContribuinte || "Não encontrado"}
                </div>
                <div>
                  Confiança da Extração:{" "}
                  {extractedInfo.confianca
                    ? `${(extractedInfo.confianca * 100).toFixed(1)}%`
                    : "N/A"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
