"use client";

import type React from "react";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import "../../styles/authStyles.css";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
interface LoginScreenProps {
  onSwitchToRegister: () => void;
}

export default function LoginScreen({ onSwitchToRegister }: LoginScreenProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      setModalTitle("Login realizado!");
      setModalMessage("Você entrou com sucesso.");
      setModalOpen(true);
    } catch (error) {
      setModalTitle("Erro ao fazer login");
      setModalMessage((error as Error).message);
      setModalOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="auth-container">
      <div className="background-pattern"></div>
      <div className="auth-content">
        <div className="auth-header">
          <h1 className="auth-title">Hunter Fiscal</h1>
          <p className="auth-subtitle">Faca login em sua conta</p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleSubmit} className="auth-form">
            <h2 className="form-title">Entrar</h2>

            <div className="input-group">
              <label className="input-label">Email</label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" aria-hidden="true" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="auth-input"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Senha</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" aria-hidden="true" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="auth-input"
                  placeholder="Sua senha"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox" />
                <span className="checkbox-text">Lembrar de mim</span>
              </label>
              <a
                href="#"
                className="forgot-link"
                onClick={(e) => e.preventDefault()}
              >
                Esqueceu sua senha?
              </a>
            </div>

            <button type="submit" className="auth-button primary">
              <span>Entrar</span>
              <ArrowRight size={20} />
            </button>

            <div className="form-switch">
              <span className="switch-text">Não tem uma conta?</span>
              <button
                type="button"
                className="switch-button"
                onClick={onSwitchToRegister}
              >
                Criar conta
              </button>
            </div>
          </form>
        </div>

        <div className="auth-footer">
          <p>Hunter Fiscal - Análise Inteligente de Documentos Fiscais</p>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (modalTitle === "Login realizado!") navigate("/upload");
        }}
        title={modalTitle}
      >
        {modalMessage}
      </Modal>
    </div>
  );
}
