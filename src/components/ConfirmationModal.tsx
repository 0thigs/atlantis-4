import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  icon?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  icon
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white'
        };
      case 'warning':
        return {
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
      default:
        return {
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          confirmButton: 'bg-gray-600 hover:bg-gray-700 text-white'
        };
    }
  };

  const styles = getTypeStyles();
  const defaultIcon = <AlertTriangle className="w-5 h-5" />;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-lg">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 items-start mb-4 sm:flex-row sm:items-center">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 ${styles.iconBg} rounded-full flex items-center justify-center`}>
                <div className={styles.iconColor}>
                  {icon || defaultIcon}
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">Esta ação não pode ser desfeita.</p>
            </div>
            <button
              onClick={onClose}
              className="self-start text-gray-400 transition-colors hover:text-gray-600 sm:self-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mb-6 text-gray-700" dangerouslySetInnerHTML={{ __html: message }} />

          <div className="flex flex-col gap-3 justify-end sm:flex-row">
            <button
              onClick={onClose}
              className="order-2 px-4 py-2 text-gray-700 rounded-md border border-gray-300 transition-colors hover:bg-gray-50 sm:order-1"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 rounded-md transition-colors order-1 sm:order-2 ${styles.confirmButton}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 