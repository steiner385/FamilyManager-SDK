import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type="button"
    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    onClick={onClick}
    aria-label="Close modal"
    data-testid="modal-close-button"
  >
    <span className="sr-only">Close modal</span>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md'
}) => {
  const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl'
  };

  if (!isOpen) return null;

  return (
    <Dialog 
      as="div"
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
      data-testid="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-label={!title ? 'Modal dialog' : undefined}
    >
      <Transition.Root show={isOpen} as={Fragment}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" aria-hidden="true" />
      </Transition.Child>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel 
            className={`relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full ${maxWidthClasses[maxWidth]} sm:p-6`}
            data-testid="modal-panel"
          >
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <CloseButton onClick={onClose} />
            </div>
            {title && (
              <Dialog.Title
                as="h1"
                id="modal-title"
                className="text-lg font-medium leading-6 text-gray-900 mb-4"
                data-testid="modal-title"
              >
                {title}
              </Dialog.Title>
            )}
            <div 
              className="modal-content"
              data-testid="modal-content"
            >
              {children}
            </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
      </Transition.Root>
    </Dialog>
  );
};
