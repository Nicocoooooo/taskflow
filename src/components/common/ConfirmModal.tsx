import React from 'react';
import Modal from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="py-4">
                <p className="text-gray-600">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={onConfirm}>
                        Supprimer
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;