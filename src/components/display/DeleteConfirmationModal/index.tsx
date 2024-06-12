import React from 'react';
import { Modal } from 'antd';
import { dictionary } from '@/utils/constants/dictionary';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

function DeleteConfirmationModal({
  visible,
  onOk,
  onCancel
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      title={dictionary.az.confirmTitle}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={dictionary.az.yesTxt}
      okType="danger"
      cancelText={dictionary.az.noTxt}
    >
      <p>{dictionary.az.confirmDelete}</p>
    </Modal>
  );
}

export default DeleteConfirmationModal;
