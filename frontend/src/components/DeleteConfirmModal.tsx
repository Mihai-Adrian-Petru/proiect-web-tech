import React from "react";
import { Modal, Button } from "react-bootstrap";

interface DeleteConfirmModalProps {
  show: boolean;
  characterName: string;
  onHide: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  show,
  characterName,
  onHide,
  onConfirm,
  loading = false,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to delete <strong>{characterName}</strong>?
        </p>
        <p className="text-muted mb-0">This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;
