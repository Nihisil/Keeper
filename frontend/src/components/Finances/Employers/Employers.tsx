import { Employer } from "client/data-contracts";
import EmployersList from "components/Finances/Employers/EmployersList";
import EmployersModalForm from "components/Finances/Employers/EmployersModalForm";
import React, { useEffect, useReducer, useState } from "react";
import { Button } from "react-bootstrap";
import api from "utils/api";

export type EmployerAction =
  | { type: "load"; employers: Employer[] }
  | { type: "create"; employer: Employer }
  | { type: "update"; employer: Employer }
  | { type: "delete"; employer: Employer };

function reducer(employers: Employer[], action: EmployerAction): Employer[] {
  switch (action.type) {
    case "load":
      return action.employers;
    case "create":
      return [action.employer, ...employers];
    case "update":
      return employers
        .map((item) =>
          item.id === action.employer.id ? action.employer : item
        )
        .sort((a, b) => ((a.updated || 0) > (b.updated || 0) ? -1 : 1));
    case "delete":
      return employers.filter((item) => item.id !== action.employer.id);
    default:
      throw Error("Unknown employers reducer action.");
  }
}

export default function Employers(): JSX.Element {
  const [modalShow, setModalShow] = useState(false);
  const [employers, dispatchEmployers] = useReducer(reducer, []);

  useEffect(() => {
    (async () => {
      const response = await api.finance.getListOfEmployers({ secure: true });
      dispatchEmployers({ type: "load", employers: response.data });
    })();
  }, []);

  return (
    <>
      <h3>
        Employers
        <Button
          variant="success"
          className="ml-4"
          size="sm"
          onClick={() => setModalShow(true)}
        >
          Create
        </Button>
      </h3>
      <EmployersList
        employers={employers}
        dispatchEmployers={dispatchEmployers}
      />
      <EmployersModalForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        afterSubmit={dispatchEmployers}
        entity={undefined}
      />
    </>
  );
}
