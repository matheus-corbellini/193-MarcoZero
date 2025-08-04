"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import "../../styles/authStyles.css";
import { useAuth } from "../../hooks/useAuth";
import Modal from "../../components/Modal";
import { Footer } from "borderless/dist/Footer.js";

interface RegisterScreenProps {
  onSwitchToLogin: () => void;
}

export default function RegisterScreen({
  onSwitchToLogin,
}: RegisterScreenProps) {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setModalTitle("Erro ao registrar");
      setModalMessage("As senhas não coincidem");
      setModalOpen(true);
      return;
    }
    try {
      await register(formData.name, formData.email, formData.password);
      setModalTitle("Conta criada!");
      setModalMessage("Seu registro foi concluído com sucesso.");
      setModalOpen(true);
    } catch (err) {
      setModalTitle("Erro ao registrar");
      setModalMessage((err as Error).message);
      setModalOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="auth-container">
      <div className="background-pattern"></div>

      <div className="auth-content">
        <div className="auth-header">
          <h1 className="auth-title">Hunter Fiscal</h1>
          <p className="auth-subtitle">Crie sua conta gratuita</p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleSubmit} className="auth-form">
            <h2 className="form-title">Criar Conta</h2>

            <div className="input-group">
              <label className="input-label">Nome Completo</label>
              <div className="input-wrapper">
                <User size={20} className="input-icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="auth-input"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Email</label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
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
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="auth-input"
                  placeholder="Crie uma senha forte"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Confirmar Senha</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="auth-input"
                  placeholder="Confirme sua senha"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <Eye size={20} />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label full-width">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="checkbox"
                  required
                />
                <span className="checkbox-text">
                  Aceito os{" "}
                  <a href="#" className="terms-link">
                    Termos de Uso
                  </a>{" "}
                  e{" "}
                  <a href="#" className="terms-link">
                    Política de Privacidade
                  </a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="auth-button primary"
              disabled={!formData.acceptTerms}
            >
              <span>Criar Conta</span>
              <ArrowRight size={20} />
            </button>

            <div className="form-switch">
              <span className="switch-text">Já tem uma conta?</span>
              <button
                type="button"
                className="switch-button"
                onClick={onSwitchToLogin}
              >
                Fazer login
              </button>
            </div>
          </form>
        </div>

        <Footer
          theme="dark"
          useGradient={false}
          backgroundColor="transparent"
          logoVariant="light"
        />
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (modalTitle === "Conta criada!") onSwitchToLogin();
        }}
        title={modalTitle}
      >
        {modalMessage}
      </Modal>
    </div>
  );
}
