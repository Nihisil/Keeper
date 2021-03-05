import { Employer } from "client/data-contracts";
import { EmployerAction } from "components/Finances/Employers/Employers";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import api from "utils/api";

interface EmployersModalFormProps {
  show: boolean;
  onHide(): void;
  afterSubmit(action: EmployerAction): void;
  entity?: Employer;
}

export type ModalData = {
  show: boolean;
  entity?: Employer;
};

export default function EmployersModalForm({
  show,
  onHide,
  afterSubmit,
  entity,
}: EmployersModalFormProps): JSX.Element {
  const [employerName, setEmployerName] = useState(entity?.name);

  useEffect(() => {
    setEmployerName(entity?.name);
  }, [entity?.name]);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let actionType: "create" | "update";
    let employer: Employer;
    if (entity) {
      actionType = "update";
      employer = entity;
      employer.name = employerName as string;
    } else {
      actionType = "create";
      employer = { name: employerName } as Employer;
      setEmployerName("");
    }
    const action = actionType === "create" ? api.finance.createEmployer : api.finance.updateEmployer;

    const response = await action(employer, { secure: true });
    afterSubmit({ type: actionType, employer: response.data });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Create Employer</Modal.Title>
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
          <Button
            onClick={() => {
              onHide();
            }}
            variant="secondary"
          >
            Close
          </Button>
          <Button type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

EmployersModalForm.defaultProps = {
  entity: undefined,
};
