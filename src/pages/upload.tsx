"use client";

import type React from "react";
import { useState } from "react";
import "../styles/uploadPage.css";
import { legislationDB } from "../type/legislation";
import { useNavigate } from "react-router-dom";
import { usePdfData } from "../context/PdfDataContext";
import { API_ROUTES } from "../api/routes";
import { ArrowLeft } from "lucide-react";

export default function HunterFiscal() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [selectedUF, setSelectedUF] = useState<string>("");
  const navigate = useNavigate();
  const { setPdfData } = usePdfData();

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
      await processWithPythonAPI(file, selectedUF);
    } catch (err) {
      setOcrText("Erro ao processar arquivo: " + err);
    }
    setIsProcessing(false);
  };

  const processWithPythonAPI = async (file: File, uf: string) => {
    try {
      setOcrProgress(10);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("uf", uf);

      setOcrProgress(30);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${API_ROUTES.EXTRACT_INFO}`,
        {
          method: "POST",
          body: formData,
        }
      );

      setOcrProgress(70);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Resposta da API:", result); // DEBUG

      setOcrProgress(100);

      // Atualizar texto extraído
      setOcrText(result.texto_extraido || "Texto não extraído");

      // Validação de CFOP, alíquota e base de cálculo
      const errors: string[] = [];
      if (uf && legislationDB[uf] && result) {
        const leg = legislationDB[uf].ICMS;
        // Tentar pegar do resultado da API, senão extrair do texto
        const cfop = result.cfop;
        let aliquota = result.aliquota;
        let baseCalculo = result.base_calculo;

        // Extrair alíquota do texto se não vier da API
        if (typeof aliquota !== "number" && result.texto_extraido) {
          const aliqMatch = result.texto_extraido.match(
            /Al[ií]quota[:\s]*["']?(\d{1,2}(?:[\.,]\d{1,2})?)%/i
          );
          if (aliqMatch) {
            aliquota = parseFloat(aliqMatch[1].replace(",", ".")) / 100;
          }
        }
        // Extrair base de cálculo do texto se não vier da API
        if (typeof baseCalculo !== "number" && result.texto_extraido) {
          const baseMatch = result.texto_extraido.match(
            /Base[:\s]*R\$\s*([\d.,]+)/i
          );
          if (baseMatch) {
            baseCalculo = parseFloat(
              baseMatch[1].replace(/\./g, "").replace(",", ".")
            );
          }
        }
        // Extrair CFOP do texto se não vier da API
        let cfopFinal = cfop;
        if (!cfopFinal && result.texto_extraido) {
          const cfopMatch =
            result.texto_extraido.match(/CFOP[:\s]*([0-9]{4})/i);
          if (cfopMatch) {
            cfopFinal = cfopMatch[1];
          }
        }
        // Validação
        if (cfopFinal && !leg.cfop_validos.includes(cfopFinal)) {
          errors.push(`CFOP ${cfopFinal} não é válido para ${uf}`);
        }
        if (typeof aliquota === "number" && aliquota !== leg.aliquota) {
          errors.push(
            `Alíquota ${aliquota * 100}% difere da legislação (${
              leg.aliquota * 100
            }%)`
          );
        }
        if (
          typeof baseCalculo === "number" &&
          baseCalculo < leg.base_calculo_minima
        ) {
          errors.push(
            `Base de cálculo ${baseCalculo} abaixo do mínimo (${leg.base_calculo_minima}) para ${uf}`
          );
        }
      }

      // Salvar no contexto global
      setPdfData({
        fileName: file.name,
        extractedDate: new Date().toLocaleDateString(),
        autoNumber: result.numero_processo,
        taxpayer: {
          name: result.nome_contribuinte,
          cnpj: result.cnpj_contribuinte,
          ie: result.ie_contribuinte,
        },
        infraction: {
          description: result.descricao_infracao,
          article: result.fundamentacao_legal,
          penalty: result.penalidade,
          fine: result.multa,
          total: result.total,
        },
        dueDate: result.data_vencimento,
        status: result.status,
        ocrText: result.texto_extraido || "",
        validationErrors: errors,
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
      <div style={{ position: "absolute", top: 24, left: 24, zIndex: 20 }}>
        <button
          type="button"
          className="back-button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0.75rem 1.5rem",
          }}
          onClick={() => navigate("/login")}
          aria-label="Voltar para Login"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
      </div>
      <h1 className="title">Hunter Fiscal</h1>
      <div className="upload-full-content">
        <div className="uploadSection">
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="uf-select"
              style={{ color: "#fff", fontWeight: 600 }}
            >
              UF:
            </label>
            <select
              id="uf-select"
              value={selectedUF}
              onChange={(e) => setSelectedUF(e.target.value)}
              style={{ marginLeft: 8, padding: 4, borderRadius: 4 }}
            >
              <option value="">Selecione o estado</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
          </div>
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
          {/* Botão Ir para Resultados */}
          {ocrText && !isProcessing && (
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <button
                type="button"
                className="goToResultsButton"
                onClick={() => navigate("/results")}
              >
                Ir para Resultados
              </button>
              <div
                style={{
                  margin: "8px auto 0 auto",
                  maxWidth: 500,
                  background: "#222",
                  color: "#fff",
                  borderRadius: 8,
                  padding: 16,
                  textAlign: "center",
                  border: "2px solid #ff8c00",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <strong>Resultados prontos!</strong>
                <div style={{ marginTop: 4 }}>
                  Clique em{" "}
                  <span style={{ color: "#ff8c00", fontWeight: 600 }}>
                    'Ir para Resultados'
                  </span>{" "}
                  para visualizar a análise completa do PDF.
                </div>
              </div>
            </div>
          )}
          <p className="description">
            {selectedFile
              ? `Arquivo selecionado: ${selectedFile.name}`
              : "Faça o upload do Auto de Infração ICMS em PDF ou img"}
          </p>
        </div>
      </div>
    </div>
  );
}
