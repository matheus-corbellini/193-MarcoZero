"use client";

import type React from "react";
import { useState, useRef } from "react";
import "../styles/uploadPage.css";
import { legislationDB } from "../type/legislation";
import { useNavigate } from "react-router-dom";
import { usePdfData } from "../hooks/usePdfData";
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

      // Extração de dados do texto antes das validações
      let aliquota = result.aliquota;
      let baseCalculo = result.base_calculo;
      let cfop = result.cfop;
      let multa = result.multa;
      let juros_multa = result.juros_multa;
      if (result.texto_extraido) {
        // Alíquota
        if (typeof aliquota !== "number") {
          const aliqMatch = result.texto_extraido.match(
            /Al[ií]quota[:\s]*["']?(\d{1,2}(?:[\.,]\d{1,2})?)%/i
          );
          if (aliqMatch)
            aliquota = parseFloat(aliqMatch[1].replace(",", ".")) / 100;
        }
        // Base de cálculo
        if (typeof baseCalculo !== "number") {
          const baseMatch = result.texto_extraido.match(
            /Base[:\s]*R\$\s*([\d.,]+)/i
          );
          if (baseMatch)
            baseCalculo = parseFloat(
              baseMatch[1].replace(/[.]/g, "").replace(",", ".")
            );
        }
        // CFOP
        if (!cfop) {
          const cfopMatch =
            result.texto_extraido.match(/CFOP[:\s]*([0-9]{4})/i);
          if (cfopMatch) cfop = cfopMatch[1];
        }
        // Multa
        if (multa === undefined || multa === null) {
          const multaMatch = result.texto_extraido.match(
            /Multa[:\s]*R\$\s*([\d.,]+)/i
          );
          if (multaMatch)
            multa = parseFloat(
              multaMatch[1].replace(/[.]/g, "").replace(",", ".")
            );
        }
        // Juros
        if (juros_multa === undefined || juros_multa === null) {
          const jurosMatch = result.texto_extraido.match(
            /Juros[:\s]*R\$\s*([\d.,]+)/i
          );
          if (jurosMatch)
            juros_multa = parseFloat(
              jurosMatch[1].replace(/[.]/g, "").replace(",", ".")
            );
        }
      }

      // Validação de CFOP, alíquota e base de cálculo
      const errors: string[] = [];
      let valorDevido = undefined;
      let leg = undefined;
      if (uf && legislationDB[uf] && result) {
        leg = legislationDB[uf].ICMS;
        const cfopFinal = cfop;
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
        // Validação de MVA
        if (result.mva && leg?.mva && result.mva !== leg.mva) {
          errors.push(`MVA ${result.mva} difere do previsto (${leg.mva})`);
        }
        // Validação de Substituição Tributária
        if (result.substituicao_tributaria && !leg?.permite_st) {
          errors.push("Substituição tributária não permitida para este caso.");
        }
        // Juros e multa desproporcionais
        if (juros_multa && multa && Number(juros_multa) > 0.2 * Number(multa)) {
          errors.push("Juros e multa considerados desproporcionais.");
        }
        // Ausência de notificação via DEC
        if (
          result.texto_extraido &&
          result.texto_extraido.toLowerCase().includes("não notificado via dec")
        ) {
          errors.push("Ausência de notificação via DEC detectada.");
        }
        // Comparativo valor devido
        if (typeof baseCalculo === "number" && leg?.aliquota) {
          valorDevido = baseCalculo * leg.aliquota;
        }
      }

      let diferencaCobradaMaior = undefined;
      if (multa && valorDevido && Number(multa) > valorDevido) {
        diferencaCobradaMaior = Number(multa) - valorDevido;
      }

      // Após receber o result
      let fundamentacaoLegal =
        result.fundamentacao_legal || result.article || "";
      if (!fundamentacaoLegal && result.texto_extraido) {
        const match = result.texto_extraido.match(
          /Fundamenta[çc][ãa]o Legal:([^\n]+)/i
        );
        if (match) {
          fundamentacaoLegal = match[1].trim();
        }
      }

      // Salvar no contexto global
      setPdfData({
        fileName: file.name,
        extractedDate: new Date().toLocaleDateString(),
        // Normalização para garantir que o número do auto venha de qualquer campo possível
        numero_auto_infracao:
          result.numero_auto_infracao ||
          result.numeroAutoInfracao ||
          result.autoNumber ||
          result.numero_processo ||
          null,
        autoNumber:
          result.numero_processo ||
          result.numero_auto_infracao ||
          result.numeroAutoInfracao ||
          null,
        taxpayer: {
          name: result.nome_contribuinte,
          cnpj: result.cnpj_contribuinte,
          ie: result.ie_contribuinte,
        },
        infraction: {
          description: result.descricao_infracao,
          article: fundamentacaoLegal,
          penalty: result.penalidade,
          fine: multa,
          total: result.total,
          aliquota_aplicada:
            typeof aliquota === "number"
              ? (aliquota * 100).toFixed(2) + "%"
              : undefined,
          aliquota_correta: leg?.aliquota
            ? (leg.aliquota * 100).toFixed(2) + "%"
            : undefined,
          base_calculo_presumida:
            typeof baseCalculo === "number"
              ? "R$ " +
                baseCalculo.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })
              : undefined,
          valor_lancado: multa
            ? "R$ " +
              Number(multa).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })
            : undefined,
          valor_devido: valorDevido
            ? "R$ " +
              valorDevido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
            : undefined,
          juros_multa: juros_multa
            ? "R$ " +
              Number(juros_multa).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })
            : undefined,
          erro_mva_st_dec: errors.find(
            (e) =>
              e.toLowerCase().includes("mva") ||
              e.toLowerCase().includes("substituição tributária") ||
              e.toLowerCase().includes("dec")
          ),
          diferenca_cobrada_maior: diferencaCobradaMaior
            ? "R$ " +
              diferencaCobradaMaior.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })
            : undefined,
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
            ref={fileInputRef}
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
          {/* Botão Ir para Resultados e mensagem de sucesso */}
          {ocrText && !isProcessing && (
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <div className="actionButtonsContainer">
                <button
                  type="button"
                  className="goToResultsButton"
                  onClick={() => navigate("/results")}
                >
                  Ir para Resultados
                </button>
                <button
                  type="button"
                  className="removeFileButton"
                  onClick={() => {
                    setSelectedFile(null);
                    setOcrText("");
                    setOcrProgress(0);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Remover arquivo
                </button>
              </div>
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
