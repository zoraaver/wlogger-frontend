import * as React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface DeleteModalProps {
  onHide: () => void;
  show: boolean;
  title: string;
  handleDeleteClick: () => void;
  handleCloseClick: () => void;
}
export function DeleteModal({
  show,
  title,
  onHide,
  handleDeleteClick,
  handleCloseClick,
}: DeleteModalProps) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        Are you sure you want to delete{" "}
        <strong className="ml-1">{title}</strong>?
      </Modal.Header>
      <Modal.Body>This action is irreversible.</Modal.Body>
      <Modal.Footer className="py-1">
        <Button variant="primary" className="py-1" onClick={handleCloseClick}>
          Close
        </Button>
        <Button variant="danger" className="py-1" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
