import { AxiosError } from "axios";
import { Employer } from "client/data-contracts";
import DisplayError from "components/App/DisplayError";
import { AccountsProps } from "components/Finances/Accounts/AccountsMethods";
import { EmployersAction } from "components/Finances/Employers/EmployersMethods";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import api from "utils/api";
import { Nullish } from "utils/base";

interface EmployersModalFormProps extends AccountsProps {
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
  accounts,
}: EmployersModalFormProps): JSX.Element {
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [formError, setFormError] = useState<Nullish<AxiosError>>(undefined);
  const [employerName, setEmployerName] = useState(entity?.name);
  const [accountId, setAccountId] = useState(entity?.associated_account_id);

  // set form defaults when edit entity
  useEffect(() => {
    setEmployerName(entity?.name);
    setAccountId(entity?.associated_account_id);
  }, [entity?.name, entity?.associated_account_id]);

  const cleanUpForm = () => {
    setEmployerName("");
    setAccountId(undefined);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (requestInProgress) {
      return;
    }

    setRequestInProgress(true);

    const actionType: "create" | "update" = entity?.id ? "update" : "create";
    const employer = { ...entity, ...{ name: employerName, associated_account_id: accountId } } as Employer;
    const action = entity?.id ? api.finance.updateEmployer : api.finance.createEmployer;

    try {
      const response = await action(employer, { secure: true });
      afterSubmit({ type: actionType, employer: response.data });

      onHide();
      cleanUpForm();
    } catch (requestError) {
      setFormError(requestError);
    }

    setRequestInProgress(false);
  };

  const accountOptions = accounts.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ));

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
          <Form.Group controlId="account">
            <Form.Label>Account</Form.Label>
            <Form.Control
              as="select"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value as string)}
              required
            >
              <option disabled selected>
                -- select an option --
              </option>
              {accountOptions}
            </Form.Control>
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
          <Button type="submit" disabled={requestInProgress}>
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

EmployersModalForm.defaultProps = {
  entity: undefined,
};
