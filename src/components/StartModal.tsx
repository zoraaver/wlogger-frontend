import * as React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface StartModalProps {
  show: boolean;
  onHide: () => void;
  title: JSX.Element;
  handleStartClick: () => void;
  handleCloseClick: () => void;
}

export function StartModal({
  show,
  onHide,
  title,
  handleCloseClick,
  handleStartClick,
}: StartModalProps) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>{title}</Modal.Header>
      <Modal.Body>
        Your position in your current plan will be lost if it is still in
        progress - you will have to restart from the beginning if you wish to
        start it again.
      </Modal.Body>
      <Modal.Footer className="py-1">
        <Button variant="primary" className="py-1" onClick={handleCloseClick}>
          Close
        </Button>
        <Button variant="success" className="py-1" onClick={handleStartClick}>
          Start
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
