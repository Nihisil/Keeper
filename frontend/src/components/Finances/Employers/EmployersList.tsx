import { Employer } from "client/data-contracts";
import ConfirmDeleteModal from "components/App/utils/ConfirmDeleteModal";
import { EmployerAction } from "components/Finances/Employers/Employers";
import EmployersModalForm, {
  ModalData,
} from "components/Finances/Employers/EmployersModalForm";
import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import api from "utils/api";
import displayDate from "utils/date";

interface EmployersListProps {
  employers: Array<Employer>;
  dispatchEmployers(action: EmployerAction): void;
}

export default function EmployersList({
  employers,
  dispatchEmployers,
}: EmployersListProps): JSX.Element {
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    toDeleteName: "",
    toDeleteId: "",
  });
  const [editModal, setEditModal] = useState({
    show: false,
    entity: undefined,
  } as ModalData);

  const deleteEmployer = (employerId: string) => {
    const employer = employers.find((item) => item.id === employerId);
    if (!employer) {
      throw Error("Not correct employer id was passed to delete function");
    }
    api.finance.deleteEmployer(employer, { secure: true }).then(() => {
      dispatchEmployers({ type: "delete", employer });
    });
  };

  const employerRows = employers.map((item) => (
    <tr key={item.id}>
      <td>{item.name}</td>
      <td>-</td>
      <td>{displayDate(item.updated)}</td>
      <td>
        <Button
          size="sm"
          className="mr-2"
          onClick={() => {
            setEditModal({ show: true, entity: item });
          }}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() =>
            setDeleteModal({
              show: true,
              toDeleteName: item.name,
              toDeleteId: item.id as string,
            })
          }
        >
          Delete
        </Button>
      </td>
    </tr>
  ));

  return (
    <>
      <Table responsive bordered striped size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Earnings</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employers.length ? (
            employerRows
          ) : (
            <tr>
              <td colSpan={4}>No data</td>
            </tr>
          )}
        </tbody>
      </Table>
      <ConfirmDeleteModal
        show={deleteModal.show}
        onHide={() =>
          setDeleteModal({ show: false, toDeleteName: "", toDeleteId: "" })
        }
        toDeleteName={deleteModal.toDeleteName}
        toDeleteId={deleteModal.toDeleteId}
        deleteAction={deleteEmployer}
      />
      <EmployersModalForm
        show={editModal.show}
        onHide={() => setEditModal({ show: false, entity: undefined })}
        afterSubmit={dispatchEmployers}
        entity={editModal.entity}
      />
    </>
  );
}
