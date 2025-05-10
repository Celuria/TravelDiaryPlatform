import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'bg-success text-white';
      case 'warning':
        return 'bg-warning text-white';
      case 'danger':
        return 'bg-danger text-white';
      default:
        return 'bg-neutral-800 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fa-check-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'danger':
        return 'fa-times-circle';
      default:
        return 'fa-info-circle';
    }
  };

  return createPortal(
    <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 opacity-100 z-50 flex items-center ${getTypeClass()}`}>
      <i className={`fa-solid ${getIcon()} mr-2`}></i>
      <span>{message}</span>
    </div>,
    document.body
  );
};

export default Notification;    