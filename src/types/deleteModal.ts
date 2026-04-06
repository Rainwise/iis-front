export interface DeleteModalProps {
  modalProps: {
    opened: boolean;
    onClose: () => void;
  };
  modalTitle?: string;
  modalDescription?: string;
  objectId?: number | string;
  onSubmit?: (id: number | string) => Promise<void>;
  loading?: boolean;
}
