import React from "react";
import "../styles/modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal-content">
        <h2 className="custom-modal-title">{title}</h2>
        <div className="custom-modal-body">{children}</div>
        <button
          className="auth-button primary custom-modal-ok"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Modal;
