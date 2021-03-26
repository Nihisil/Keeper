import { AxiosError } from "axios";
import { FinanceCategory } from "client/data-contracts";
import DisplayError from "components/App/DisplayError";
import { FinanceCategoriesAction } from "components/Finances/FinanceCategories/FinanceCategoriesMethods";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import api from "utils/api";
import { Nullish } from "utils/base";

interface FinanceCategoriesModalFormProps {
  show: boolean;
  onHide(): void;
  afterSubmit(action: FinanceCategoriesAction): void;
  entity?: FinanceCategory;
}

export default function FinanceCategoriesModalForm({
  show,
  onHide,
  afterSubmit,
  entity,
}: FinanceCategoriesModalFormProps): JSX.Element {
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [formError, setFormError] = useState<Nullish<AxiosError>>(undefined);
  const [financeCategoryName, setFinanceCategoryName] = useState(entity?.name);

  // set form defaults when edit entity
  useEffect(() => {
    setFinanceCategoryName(entity?.name);
  }, [entity?.name]);

  const cleanUpForm = () => {
    setFinanceCategoryName("");
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (requestInProgress) {
      return;
    }

    setRequestInProgress(true);

    const actionType: "create" | "update" = entity?.id ? "update" : "create";
    const financeCategory = {
      ...entity,
      ...{
        name: financeCategoryName,
      },
    } as FinanceCategory;
    const action = entity?.id ? api.finance.updateFinanceCategory : api.finance.createFinanceCategory;

    try {
      const response = await action(financeCategory, { secure: true });
      afterSubmit({ type: actionType, financeCategory: response.data });

      onHide();
      cleanUpForm();
    } catch (requestError) {
      setFormError(requestError);
    }

    setRequestInProgress(false);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Create FinanceCategory</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <DisplayError error={formError} />
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              value={financeCategoryName}
              placeholder="Name"
              onChange={(e) => setFinanceCategoryName(e.target.value)}
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
          <Button type="submit" disabled={requestInProgress}>
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

FinanceCategoriesModalForm.defaultProps = {
  entity: undefined,
};
