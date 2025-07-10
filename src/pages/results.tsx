"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  ArrowLeft,
  Building,
  Calendar,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

import "../styles/results.css";
import "../styles/results/reportModal.css";
import { usePdfData } from "../context/PdfDataContext";

export default function PdfResultsScreen() {
  const [showDetails, setShowDetails] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { pdfData } = usePdfData();

  console.log("pdfData:", pdfData);
  console.log("pdfData.infraction:", pdfData?.infraction);
  console.log("pdfData.infraction.article:", pdfData?.infraction?.article);

  if (!pdfData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          color: "#fff",
        }}
      >
        <div>
          <h2>Nenhum dado encontrado</h2>
          <p>
            Por favor, faça o upload de um PDF ou imagem para visualizar os
            resultados.
          </p>
        </div>
      </div>
    );
  }

  // Dicionário de jurisprudência relevante
  const jurisprudenciaMap: Record<
    string,
    Array<{ tribunal: string; sumula: string; ementa: string }>
  > = {
    "Art. 155, §2º, CF/88": [
      {
        tribunal: "STF",
        sumula: "Súmula 323",
        ementa:
          "É inadmissível a apreensão de mercadorias como meio coercitivo para pagamento de tributos.",
      },
      {
        tribunal: "STF",
        sumula: "Súmula Vinculante 31",
        ementa:
          "É inconstitucional a exigência de depósito prévio como requisito de admissibilidade de ação judicial na qual se pretenda discutir a exigibilidade de crédito tributário.",
      },
    ],
    "Art. 97, II do CTN": [
      {
        tribunal: "STJ",
        sumula: "Súmula 160",
        ementa:
          "É nula a decisão que não examina todos os argumentos da defesa.",
      },
      {
        tribunal: "STF",
        sumula: "Súmula 544",
        ementa:
          "Isenção concedida, por lei municipal, de tributo da competência da União ou de Estado, não é eficaz antes da respectiva autorização.",
      },
    ],
    "Art. 144 do CTN": [
      {
        tribunal: "STJ",
        sumula: "Súmula 436",
        ementa:
          "A entrega de declaração pelo contribuinte reconhecendo o débito fiscal constitui o crédito tributário, dispensada qualquer outra providência por parte do Fisco.",
      },
    ],
    "Art. 150, §7º, CF/88": [
      {
        tribunal: "STF",
        sumula: "Súmula 555",
        ementa:
          "É legítima a cobrança do ICMS sobre o valor da tarifa de energia elétrica.",
      },
    ],
    "Art. 146, III, CF/88": [
      {
        tribunal: "STF",
        sumula: "Súmula 574",
        ementa:
          "Não é legítima a cobrança de tributo sem lei que o estabeleça.",
      },
    ],
    "Art. 112 do CTN": [
      {
        tribunal: "STJ",
        sumula: "Súmula 555",
        ementa:
          "Na dúvida quanto à interpretação de legislação tributária, adota-se a interpretação mais favorável ao contribuinte.",
      },
    ],
    "Art. 150, VI, CF/88": [
      {
        tribunal: "STF",
        sumula: "Súmula 724",
        ementa:
          "Não é isenta de ICMS a exportação de mercadorias para o exterior.",
      },
    ],
    "Art. 3º, RICMS/RJ": [
      {
        tribunal: "TJRJ",
        sumula: "Súmula 183",
        ementa:
          "O ICMS não incide sobre operações de transferência de mercadorias entre estabelecimentos do mesmo contribuinte.",
      },
    ],
    "Art. 23, CF/88": [
      {
        tribunal: "STF",
        sumula: "Súmula 347",
        ementa:
          "O Tribunal de Contas, no exercício de suas atribuições, pode apreciar a constitucionalidade das leis e dos atos do Poder Público.",
      },
    ],
    "Art. 150, I, CF/88": [
      {
        tribunal: "STF",
        sumula: "Súmula 654",
        ementa:
          "A cobrança de tributo em virtude de lei inconstitucional é indevida.",
      },
    ],
    "Art. 5º, XXXV, CF/88": [
      {
        tribunal: "STF",
        sumula: "Súmula 347",
        ementa:
          "O Tribunal de Contas, no exercício de suas atribuições, pode apreciar a constitucionalidade das leis e dos atos do Poder Público.",
      },
    ],
    "Art. 150, §6º, CF/88": [
      {
        tribunal: "STF",
        sumula: "Súmula 544",
        ementa:
          "Isenção concedida, por lei municipal, de tributo da competência da União ou de Estado, não é eficaz antes da respectiva autorização.",
      },
    ],
    "Art. 97, VI do CTN": [
      {
        tribunal: "STJ",
        sumula: "Súmula 555",
        ementa:
          "Na dúvida quanto à interpretação de legislação tributária, adota-se a interpretação mais favorável ao contribuinte.",
      },
    ],
    "Art. 150, §4º, CF/88": [
      {
        tribunal: "STF",
        sumula: "Súmula 654",
        ementa:
          "A cobrança de tributo em virtude de lei inconstitucional é indevida.",
      },
    ],
    "Art. 23, §1º, CF/88": [
      {
        tribunal: "STF",
        sumula: "Súmula 347",
        ementa:
          "O Tribunal de Contas, no exercício de suas atribuições, pode apreciar a constitucionalidade das leis e dos atos do Poder Público.",
      },
    ],
  };

  return (
    <div className="container">
      {/* Background pattern */}
      <div className="background-pattern"></div>
      <div className="content">
        {/* Header */}
        <div className="header">
          <h1 className="title">Hunter Fiscal</h1>
          <p className="subtitle">Resultados da Análise do PDF</p>
        </div>
        {/* Back button */}
        <button className="back-button" onClick={() => window.history.back()}>
          <ArrowLeft size={16} />
          Voltar
        </button>
        {/* Main content */}
        <div className="main-content">
          {/* File info card */}
          <div className="card">
            <div className="file-info">
              <div className="file-details">
                <FileText size={32} color="#ff8c00" />
                <div>
                  <h3 className="file-name">{pdfData.fileName}</h3>
                  <p className="file-date">
                    Extraído em {pdfData.extractedDate}
                  </p>
                </div>
              </div>
              <span className="status-badge">{pdfData.status}</span>
            </div>
            <div className="button-group">
              <button
                className="primary-button"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Eye size={16} />
                {showDetails ? "Ocultar Detalhes" : "Ver Detalhes"}
              </button>
              <button className="secondary-button">
                <Download size={16} />
                Baixar Relatório
              </button>
              <button
                className="secondary-button"
                onClick={() => setShowReportModal(!showReportModal)}
              >
                Comparativo Fiscal
              </button>
            </div>
          </div>
          {/* Modal de Relatório Comparativo */}
          {showReportModal && (
            <div
              className="modal-overlay"
              onClick={() => setShowReportModal(false)}
            >
              <div
                className="modal-content fiscal-report-modal expanded"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="report-title">RELATÓRIO</h2>
                <div className="report-section">
                  <div className="report-label">Auto de Infração:</div>
                  <div className="report-value mono">
                    {pdfData.numero_auto_infracao ??
                      pdfData.autoNumber ??
                      "N/A"}
                  </div>
                </div>
                <div className="report-section">
                  <div className="report-label">Alíquota aplicada:</div>
                  <div className="report-value">
                    {pdfData.infraction?.aliquota_aplicada ?? "N/A"}
                  </div>
                </div>
                <div className="report-section">
                  <div className="report-label">Alíquota correta:</div>
                  <div className="report-value">
                    {pdfData.infraction?.aliquota_correta ?? "N/A"}
                  </div>
                </div>
                <div className="report-section">
                  <div className="report-label">Base de cálculo presumida:</div>
                  <div className="report-value">
                    {pdfData.infraction?.base_calculo_presumida ?? "N/A"}
                  </div>
                </div>
                <div className="report-section">
                  <div className="report-label">Valor lançado:</div>
                  <div className="report-value">
                    {pdfData.infraction?.valor_lancado ??
                      pdfData.infraction?.fine ??
                      "N/A"}
                  </div>
                </div>
                <div className="report-section">
                  <div className="report-label">Valor devido:</div>
                  <div className="report-value">
                    {pdfData.infraction?.valor_devido ?? "N/A"}
                  </div>
                </div>
                <div className="report-section">
                  <div className="report-label">Diferença cobrada a maior:</div>
                  <div className="report-value warning">
                    <AlertTriangle
                      size={18}
                      style={{ verticalAlign: "middle", marginRight: 6 }}
                    />
                    {pdfData.infraction?.diferenca_cobrada_maior ?? "N/A"}
                  </div>
                </div>
                <div className="report-section">
                  <div className="report-label">Juros e multa:</div>
                  <div className="report-value">
                    {pdfData.infraction?.juros_multa ??
                      pdfData.infraction?.fine ??
                      "N/A"}
                  </div>
                </div>
                <div className="report-section">
                  <div className="report-label">Erro de MVA/ST/DEC:</div>
                  <div className="report-value">
                    {pdfData.infraction?.erro_mva_st_dec ?? "N/A"}
                  </div>
                </div>
                <div className="report-section">
                  <div className="report-label">
                    Dispositivos Legais Infringidos:
                  </div>
                  <ul className="report-list">
                    {pdfData.infraction?.article?.split(";").map((art, idx) => (
                      <li key={idx}>
                        {art.trim()}
                        {jurisprudenciaMap[art.trim()] && (
                          <ul className="juris-list">
                            {jurisprudenciaMap[art.trim()].map((jur, jdx) => (
                              <li key={jdx}>
                                <strong>
                                  {jur.tribunal} - {jur.sumula}:
                                </strong>{" "}
                                {jur.ementa}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                {pdfData.validationErrors &&
                  pdfData.validationErrors.length > 0 && (
                    <div className="report-section">
                      <div
                        className="report-label"
                        style={{ color: "#ef4444" }}
                      >
                        <strong>Potenciais erros encontrados:</strong>
                      </div>
                      <ul className="report-list">
                        {pdfData.validationErrors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          )}
          {/* Details section */}
          {showDetails && (
            <div className="details-section show">
              {/* Auto de Infração Info */}
              <div className="card">
                <h3 className="section-title">
                  <AlertTriangle size={20} /> Informações do Auto
                </h3>
                <div className="grid-two">
                  <div className="field">
                    <label className="field-label">Número do Auto</label>
                    <p className="field-value mono">{pdfData.autoNumber}</p>
                  </div>
                  <div className="field">
                    <label className="field-label">Data de Vencimento</label>
                    <p className="field-value">
                      <Calendar size={16} /> {pdfData.dueDate}
                    </p>
                  </div>
                </div>
                {pdfData.ocrText && (
                  <div style={{ marginTop: "1rem" }}>
                    <label className="field-label">Texto Extraído</label>
                    <pre
                      style={{
                        background: "#18181b",
                        color: "#fff",
                        borderRadius: 6,
                        padding: 12,
                        fontSize: 14,
                        whiteSpace: "pre-wrap",
                        margin: 0,
                      }}
                    >
                      {pdfData.ocrText}
                    </pre>
                  </div>
                )}
                {pdfData.validationErrors &&
                  pdfData.validationErrors.length > 0 && (
                    <div style={{ marginTop: "1rem", color: "#ef4444" }}>
                      <strong>Potenciais erros encontrados:</strong>
                      <ul style={{ margin: "0.5rem 0 0 1.5rem" }}>
                        {pdfData.validationErrors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
              {/* Taxpayer Info */}
              <div className="card">
                <h3 className="section-title">
                  <Building size={20} /> Dados do Contribuinte
                </h3>
                <div className="field">
                  <label className="field-label">Razão Social</label>
                  <p className="field-value">{pdfData.taxpayer?.name}</p>
                </div>
                <div className="grid-two">
                  <div className="field">
                    <label className="field-label">CNPJ</label>
                    <p className="field-value mono">{pdfData.taxpayer?.cnpj}</p>
                  </div>
                  <div className="field">
                    <label className="field-label">Inscrição Estadual</label>
                    <p className="field-value mono">{pdfData.taxpayer?.ie}</p>
                  </div>
                </div>
              </div>
              {/* Infraction Details */}
              <div className="card">
                <h3 className="section-title">
                  <DollarSign size={20} /> Detalhes da Infração
                </h3>
                <div className="field">
                  <label className="field-label">Descrição</label>
                  <p className="field-value">
                    {pdfData.infraction?.description}
                  </p>
                </div>
                <div className="field">
                  <label className="field-label">Fundamentação Legal</label>
                  <p className="field-value">{pdfData.infraction?.article}</p>
                </div>
                <div className="separator"></div>
                <div className="grid-three">
                  <div className="field">
                    <label className="field-label">Penalidade</label>
                    <p className="field-value bold">
                      {pdfData.infraction?.penalty}
                    </p>
                  </div>
                  <div className="field">
                    <label className="field-label">Multa</label>
                    <p className="field-value bold">
                      {pdfData.infraction?.fine}
                    </p>
                  </div>
                  <div className="field">
                    <label className="field-label">Total</label>
                    <p className="field-value total">
                      {pdfData.infraction?.total}
                    </p>
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="card">
                <h3 className="section-title">Ações Disponíveis</h3>
                <div className="button-group">
                  <button className="primary-button">Gerar Defesa</button>
                  <button className="secondary-button">Exportar Dados</button>
                  <button className="secondary-button">Salvar Análise</button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="footer">
          <p>Hunter Fiscal - Análise Inteligente de Documentos Fiscais</p>
        </div>
      </div>
    </div>
  );
}
