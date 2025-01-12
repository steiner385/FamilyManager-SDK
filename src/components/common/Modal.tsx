import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';
import type { BaseComponentProps } from './types';

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [isModalRootReady, setIsModalRootReady] = useState(false);

  // Cleanup function to restore document state
  const cleanupDocumentState = () => {
    const rootElements = document.body.children;
    for (let i = 0; i < rootElements.length; i++) {
      const element = rootElements[i] as HTMLElement;
      if (element.id !== 'modal-root' && !element.hasAttribute('data-testid')) {
        element.removeAttribute('inert');
        element.removeAttribute('aria-hidden');
      }
    }
    document.body.style.overflow = 'unset';
    if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return () => {}; // Return empty cleanup for when modal is closed
    }

    // Create modal root if it doesn't exist
    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      modalRoot.setAttribute('data-testid', 'modal-root');
      document.body.appendChild(modalRoot);
    }
    
    // Store the current active element
    previousActiveElement.current = document.activeElement as HTMLElement;
    
    // Prevent background scrolling and interaction
    document.body.style.overflow = 'hidden';
    
    // Set inert on all root-level elements except modal-root and notification container
    const rootElements = document.body.children;
    for (let i = 0; i < rootElements.length; i++) {
      const element = rootElements[i] as HTMLElement;
      if (element.id !== 'modal-root' && !element.hasAttribute('data-testid')) {
        element.setAttribute('inert', '');
        element.setAttribute('aria-hidden', 'true');
      }
    }

    // Handle escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Focus the close button after mount
    setTimeout(() => {
      const closeButton = modalRef.current?.querySelector('[data-testid="modal-close-button"]');
      if (closeButton instanceof HTMLElement) {
        closeButton.focus();
      }
    }, 0);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      cleanupDocumentState();
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return () => {}; // Return empty cleanup for when modal is closed
    }

    const modalRoot = document.getElementById('modal-root') || 
      document.createElement('div');
    
    if (!modalRoot.id) {
      modalRoot.id = 'modal-root';
      modalRoot.setAttribute('data-testid', 'modal-root');
      document.body.appendChild(modalRoot);
    }
    
    setIsModalRootReady(true);

    return () => {
      // Only remove if we created it
      if (!document.getElementById('modal-root')) {
        modalRoot.remove();
      }
    };
  }, [isOpen]);

  if (!isOpen || !isModalRootReady) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 pointer-events-none"
      onClick={handleBackdropClick}
      role="presentation"
      data-testid="modal-backdrop"
      aria-hidden="true"
    >
      <FocusTrap
        focusTrapOptions={{
          initialFocus: '[data-testid="modal-close-button"]',
          escapeDeactivates: true,
          allowOutsideClick: false,
          returnFocusOnDeactivate: true,
          fallbackFocus: '[role="dialog"]',
          clickOutsideDeactivates: true,
          tabbableOptions: {
            displayCheck: 'none',
          },
          includeContainer: true,
          preventScroll: true
        }}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full mx-4 focus:outline-none pointer-events-auto"
          tabIndex={-1}
          data-testid="modal-dialog"
          data-modal="true"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              aria-label="Close"
              data-testid="modal-close-button"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>{children}</div>
        </div>
      </FocusTrap>
    </div>,
    modalRoot
  );
};
