import { AxiosError } from "axios";
import { Employer } from "client/data-contracts";
import DisplayError from "components/App/DisplayError";
import { EmployersAction } from "components/Finances/Employers/Employers";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import api from "utils/api";
import { Nullish } from "utils/base";

interface EmployersModalFormProps {
  show: boolean;
  onHide(): void;
  afterSubmit(action: EmployersAction): void;
  entity?: Employer;
}

export default function EmployersModalForm({
  show,
  onHide,
  afterSubmit,
  entity,
}: EmployersModalFormProps): JSX.Element {
  const [formError, setFormError] = useState<Nullish<AxiosError>>(undefined);
  const [employerName, setEmployerName] = useState(entity?.name);

  // set form defaults when edit entity
  useEffect(() => {
    setEmployerName(entity?.name);
  }, [entity?.name]);

  const cleanUpForm = () => {
    setEmployerName("");
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const actionType: "create" | "update" = entity?.id ? "update" : "create";
    const employer = { ...entity, ...{ name: employerName } } as Employer;
    const action = entity?.id ? api.finance.updateEmployer : api.finance.createEmployer;

    try {
      const response = await action(employer, { secure: true });
      afterSubmit({ type: actionType, employer: response.data });

      onHide();
      cleanUpForm();
    } catch (requestError) {
      setFormError(requestError);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Create Employer</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <DisplayError error={formError} />
          <Form.Group controlId="name">
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
