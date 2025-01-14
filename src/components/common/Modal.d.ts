import React from 'react';
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}
export declare const Modal: React.FC<ModalProps>;
//# sourceMappingURL=Modal.d.ts.map