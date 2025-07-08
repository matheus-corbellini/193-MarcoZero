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
import { usePdfData } from "../context/PdfDataContext";

export default function PdfResultsScreen() {
  const [showDetails, setShowDetails] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { pdfData } = usePdfData();

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
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Relatório Comparativo Fiscal</h2>
                <ul style={{ margin: "1rem 0" }}>
                  <li>
                    <strong>Alíquota aplicada:</strong>{" "}
                    {pdfData.infraction?.aliquota_aplicada ?? "N/A"}
                  </li>
                  <li>
                    <strong>Alíquota correta:</strong>{" "}
                    {pdfData.infraction?.aliquota_correta ?? "N/A"}
                  </li>
                  <li>
                    <strong>Base de cálculo presumida:</strong>{" "}
                    {pdfData.infraction?.base_calculo_presumida ?? "N/A"}
                  </li>
                  <li>
                    <strong>Valor lançado:</strong>{" "}
                    {pdfData.infraction?.valor_lancado ??
                      pdfData.infraction?.fine ??
                      "N/A"}
                  </li>
                  <li>
                    <strong>Valor devido:</strong>{" "}
                    {pdfData.infraction?.valor_devido ?? "N/A"}
                  </li>
                  <li>
                    <strong>Diferença cobrada a maior:</strong>{" "}
                    {pdfData.infraction?.diferenca_cobrada_maior ?? "N/A"}
                  </li>
                  <li>
                    <strong>Juros e multa:</strong>{" "}
                    {pdfData.infraction?.juros_multa ??
                      pdfData.infraction?.fine ??
                      "N/A"}
                  </li>
                  <li>
                    <strong>Erro de MVA/ST/DEC:</strong>{" "}
                    {pdfData.infraction?.erro_mva_st_dec ?? "N/A"}
                  </li>
                </ul>
                {pdfData.validationErrors &&
                  pdfData.validationErrors.length > 0 && (
                    <div style={{ color: "#ef4444", marginBottom: 12 }}>
                      <strong>Potenciais erros encontrados:</strong>
                      <ul style={{ margin: "0.5rem 0 0 1.5rem" }}>
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
