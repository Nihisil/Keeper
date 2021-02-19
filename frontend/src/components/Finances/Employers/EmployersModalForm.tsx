import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Employer } from "client/data-contracts";
import api from "utils/api";

interface EmployersModalFormProps {
  show: boolean;
  onHide: any;
  afterSubmit: any;
  defaultName: string;
}

export default function EmployersModalForm({
  show,
  onHide,
  afterSubmit,
  defaultName,
}: EmployersModalFormProps): JSX.Element {
  const [employerName, setEmployerName] = useState(defaultName);

  useEffect(() => {
    setEmployerName(defaultName);
  }, [defaultName]);

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const employer = { name: employerName } as Employer;
    api.finance.createEmployer(employer, { secure: true }).then((data) => {
      afterSubmit(data.data);
      onHide(false);
    });
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
          Create Employer
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Employer name</Form.Label>
            <Form.Control
              type="name"
              value={employerName}
              placeholder="Employer name"
              onChange={(e) => setEmployerName(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide} variant="secondary">
            Close
          </Button>
          <Button type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
