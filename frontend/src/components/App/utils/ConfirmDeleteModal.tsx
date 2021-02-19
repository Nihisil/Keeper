import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

interface ConfirmDeleteModalProps {
  show: boolean;
  onHide: any;
  deleteAction: any;
  toDeleteName: string;
  toDeleteId: string;
}

export default function ConfirmDeleteModal({
  show,
  onHide,
  deleteAction,
  toDeleteName,
  toDeleteId,
}: ConfirmDeleteModalProps): JSX.Element {
  const handleDeleteButton = (e: React.MouseEvent) => {
    deleteAction(toDeleteId);
    onHide();
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Confirm deleteion
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete "{toDeleteName}"?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} variant="secondary">
          Close
        </Button>
        <Button variant="danger" onClick={handleDeleteButton}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
