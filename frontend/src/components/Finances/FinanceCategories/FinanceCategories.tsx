import FinanceCategoriesList from "components/Finances/FinanceCategories/FinanceCategoriesList";
import { FinanceCategoriesProps } from "components/Finances/FinanceCategories/FinanceCategoriesMethods";
import FinanceCategoriesModalForm from "components/Finances/FinanceCategories/FinanceCategoriesModalForm";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import api from "utils/api";

export default function FinanceCategories({
  financeCategories,
  dispatchFinanceCategories,
}: FinanceCategoriesProps): JSX.Element {
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await api.finance.getListOfFinanceCategories({ secure: true });
      dispatchFinanceCategories({ type: "load", financeCategories: response.data });
    })();
  }, [dispatchFinanceCategories]);

  return (
    <>
      <h3>
        Finance Categories
        <Button variant="success" className="ml-4" size="sm" onClick={() => setModalShow(true)}>
          Create
        </Button>
      </h3>
      <FinanceCategoriesList
        financeCategories={financeCategories}
        dispatchFinanceCategories={dispatchFinanceCategories}
      />
      <FinanceCategoriesModalForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        afterSubmit={dispatchFinanceCategories}
        entity={undefined}
      />
    </>
  );
}
