import { FinanceCategory } from "client/data-contracts";
import ConfirmDeleteModal from "components/App/General/ConfirmDeleteModal";
import { FinanceCategoriesProps } from "components/Finances/FinanceCategories/FinanceCategoriesMethods";
import FinanceCategoriesModalForm from "components/Finances/FinanceCategories/FinanceCategoriesModalForm";
import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import api from "utils/api";
import { displayDatetime } from "utils/date";
import { displayMoney } from "utils/finances";

interface FinanceCategoriesModalData {
  show: boolean;
  entity?: FinanceCategory;
}

export default function FinanceCategoriesList({
  financeCategories,
  dispatchFinanceCategories,
}: FinanceCategoriesProps): JSX.Element {
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    toDeleteName: "",
    toDeleteId: "",
  });
  const [editModal, setEditModal] = useState({
    show: false,
    entity: undefined,
  } as FinanceCategoriesModalData);

  const deleteFinanceCategory = async (financeCategoryId: string) => {
    const financeCategory = financeCategories.find((item) => item.id === financeCategoryId);
    if (!financeCategory) {
      throw Error("Not correct financeCategory id was passed to delete function");
    }
    await api.finance.deleteFinanceCategory(financeCategory, { secure: true });
    dispatchFinanceCategories({ type: "delete", financeCategory });
  };

  const financeCategoryRows = financeCategories.map((item) => (
    <tr key={item.id}>
      <td>{item.name}</td>
      <td>{displayMoney(item.amount as number)}</td>
      <td>{displayDatetime(item.updated)}</td>
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
      <Table responsive bordered striped size="sm" data-testid="finance-categories-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {financeCategories.length ? (
            financeCategoryRows
          ) : (
            <tr>
              <td colSpan={3}>No data</td>
            </tr>
          )}
        </tbody>
      </Table>
      <ConfirmDeleteModal
        show={deleteModal.show}
        onHide={() => setDeleteModal({ show: false, toDeleteName: "", toDeleteId: "" })}
        toDeleteName={deleteModal.toDeleteName}
        toDeleteId={deleteModal.toDeleteId}
        deleteAction={deleteFinanceCategory}
      />
      <FinanceCategoriesModalForm
        show={editModal.show}
        onHide={() => setEditModal({ show: false, entity: undefined })}
        afterSubmit={dispatchFinanceCategories}
        entity={editModal.entity}
      />
    </>
  );
}
