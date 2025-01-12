import { createContext, useContext, useState } from 'react';
import { Toast, ToastType } from '../components/common/Toast';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');

  const showToast = (newMessage: string, newType: ToastType = 'info') => {
    setMessage(newMessage);
    setType(newType);
    setShow(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {show && (
        <Toast 
          message={message} 
          type={type} 
          onClose={() => setShow(false)} 
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
