"use client";

import type React from "react";

import { useState } from "react";
import "../styles/uploadPage.css";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

function preprocessText(text: string): string {
  return text
    .replace(/[^\w\sáéíóúãõâêîôûàèìòùçÁÉÍÓÚÃÕÂÊÎÔÛÀÈÌÒÙÇ]/gi, "")
    .replace(/\s+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function extrairNomeInteligente(texto: string): string {
  const linhas = texto
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  for (let i = 0; i < linhas.length; i++) {
    if (
      /PROPRIET[ÁA]RIO|CONTRIBUINTE|NOME|EMPRESA|TITULAR/i.test(linhas[i]) &&
      linhas[i + 1]
    ) {
      return linhas[i + 1].trim();
    }
  }

  const nomeLinha = linhas.find(
    (l) => /^[A-ZÀ-Ý'\-\s]{5,}$/.test(l) && l.split(" ").length > 1
  );
  if (nomeLinha) return nomeLinha.trim();

  for (let i = 1; i < linhas.length - 1; i++) {
    if (
      /VE[IÍ]CULO/i.test(linhas[i - 1]) &&
      /INFRA[CÇ][AÃ]O/i.test(linhas[i + 1])
    ) {
      return linhas[i].trim();
    }
  }

  const possivelNome = linhas.find(
    (l) =>
      /^[A-ZÀ-Ý'\-\s]{5,}$/.test(l) &&
      l.split(" ").length > 1 &&
      !/\d/.test(l) &&
      !/(PREFEITURA|SECRETARIA|NOTIFICAÇÃO|MENSAGEM|INFORMAÇÕES|DEFESA|AUTUAÇÃO|LOCAL|DATA|HORA|PLACA|CÓDIGO|ARTIGO|VALOR|PONTOS|OBSERVAÇÃO|CONDUTOR|IDENTIFICADO|NÃO|ATO|INFRAÇÃO|VEÍCULO|CATEGORIA|ESPÉCIE|PROPRIETÁRIO|PASSAGEIRO|EMISSÃO|Nº|ART|INCISO|MÉDIA|GRAVE|LEVE|GRAVÍSSIMA)/i.test(
        l
      )
  );
  if (possivelNome) return possivelNome.trim();

  return "";
}

function extrairInfo(texto: string) {
  const regexCNPJ = /\b\d{2}[.\s]?\d{3}[.\s]?\d{3}[/.\s]?\d{4}[-\s]?\d{2}\b/g;

  const regexAIT = /N[º°]?\s*AIT[:\s-]*([A-Z0-9-]+)/i;
  const regexRENAINF = /NUM[.\s]*RENAINF[:\s-]*([A-Z0-9-]+)/i;
  const regexNumerosLongos = /\b\d{8,}\b/g;

  let numeroAIT = "";
  let numeroRENAINF = "";
  let outrosNumeros = [];

  const aitMatch = texto.match(regexAIT);
  if (aitMatch && aitMatch[1]) numeroAIT = aitMatch[1];

  const renainfMatch = texto.match(regexRENAINF);
  if (renainfMatch && renainfMatch[1]) numeroRENAINF = renainfMatch[1];

  outrosNumeros = texto.match(regexNumerosLongos) || [];

  const nome = extrairNomeInteligente(texto);

  const cnpjs = texto.match(regexCNPJ) || [];

  return {
    numeroAIT,
    numeroRENAINF,
    outrosNumeros,
    nome,
    cnpjs,
  };
}

export default function HunterFiscal() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);

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
      if (file.type === "application/pdf") {
        await processPdf(file);
      } else if (file.type.startsWith("image/")) {
        await runOcr(file);
      } else {
        alert("Arquivo não suportado. Envie PDF ou imagem.");
      }
    } catch (err) {
      setOcrText("Erro ao processar arquivo: " + err);
    }
    setIsProcessing(false);
  };

  const processPdf = async (file: File) => {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      try {
        const typedarray = new Uint8Array(this.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let fullText = "";
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          setOcrProgress(Math.round(((pageNum - 1) / pdf.numPages) * 100));
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (context) {
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvasContext: context, viewport }).promise;
            const text = await runOcr(canvas);
            fullText += `\n--- Página ${pageNum} ---\n` + text;
          }
        }
        setOcrText(preprocessText(fullText));
        setOcrProgress(100);
      } catch (err) {
        setOcrText("Erro ao processar PDF: " + err);
      }
    };
    fileReader.readAsArrayBuffer(file);
  };

  const runOcr = async (image: File | HTMLCanvasElement) => {
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(image, "por", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });
      setOcrText((prev) => preprocessText(prev ? prev + "\n" + text : text));
      return text;
    } catch (err) {
      setOcrText("Erro no OCR: " + err);
      return "";
    }
  };

  const triggerFileSelect = () => {
    if (!isProcessing) {
      document.getElementById("file-upload")?.click();
    }
  };

  const infoExtraida = extrairInfo(ocrText);

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
              ? `Reconhecendo... ${ocrProgress}%`
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
                <strong>Extração automática:</strong>
                <div>Nº AIT: {infoExtraida.numeroAIT || "Não encontrado"}</div>
                <div>
                  NUM. RENAINF: {infoExtraida.numeroRENAINF || "Não encontrado"}
                </div>
                <div>
                  Outros números longos:{" "}
                  {infoExtraida.outrosNumeros.length > 0
                    ? infoExtraida.outrosNumeros.join(", ")
                    : "Não encontrado"}
                </div>
                <div>
                  Nome do proprietário/contribuinte:{" "}
                  {infoExtraida.nome || "Não encontrado"}
                </div>
                <div>
                  CNPJ(s):{" "}
                  {infoExtraida.cnpjs.length > 0
                    ? infoExtraida.cnpjs.join(", ")
                    : "Não encontrado"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
