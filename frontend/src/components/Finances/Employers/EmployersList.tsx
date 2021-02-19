import React, { useState } from "react";
import { Employer } from "client/data-contracts";
import { Button, Table } from "react-bootstrap";
import { displayDate } from "utils/date";
import ConfirmDeleteModal from "components/App/utils/ConfirmDeleteModal";
import EmployersModalForm from "./EmployersModalForm";

interface EmployersListProps {
  employers: Array<Employer>;
  afterEmployerDeleted: any;
}

export default function EmployersList({
  employers,
  afterEmployerDeleted,
}: EmployersListProps): JSX.Element {
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    toDeleteName: "",
    toDeleteId: "",
  });
  const [editModal, setEditModal] = useState({
    show: false,
    name: "",
  });

  const employerRows = employers.map((item, index) => (
    <tr>
      <td>{item.name}</td>
      <td>-</td>
      <td>{displayDate(item.updated)}</td>
      <td>
        <Button
          size="sm"
          className="mr-2"
          onClick={() => {
            setEditModal({ show: true, name: item.name });
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
        deleteAction={afterEmployerDeleted}
      />
      <EmployersModalForm
        show={editModal.show}
        onHide={() => setEditModal({ show: false, name: "" })}
        afterSubmit={() => {}}
        defaultName={editModal.name}
      />
    </>
  );
}
