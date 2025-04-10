import React from 'react';
import ReactDOM from 'react-dom';
import './ImageModal.css';

const ImageModal = ({ imageSrc, onClose }) => {
  return ReactDOM.createPortal(
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <img src={imageSrc} alt="Полное изображение" />
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default ImageModal;
