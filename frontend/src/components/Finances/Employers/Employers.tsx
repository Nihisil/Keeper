import React, { Suspense, useState } from "react";
import { Button } from "react-bootstrap";
import EmployersList from "components/Finances/Employers/EmployersList";
import EmployersModalForm from "components/Finances/Employers/EmployersModalForm";
import api, { fetchData } from "utils/api";
import { Employer } from "client/data-contracts";

const initEmployers = fetchData(api.finance.getListOfEmployers);

export default function Employers(): JSX.Element {
  const [modalShow, setModalShow] = useState(false);
  const [employers, setEmployers] = useState(initEmployers.read());

  const afterEmployerCreated = (employer: Employer) => {
    setEmployers([...employers, employer]);
  };

  return (
    <>
      <h3>
        Employers
        <Button className="ml-4" size="sm" onClick={() => setModalShow(true)}>
          Create
        </Button>
      </h3>
      <Suspense fallback={<p>Loading employers...</p>}>
        <EmployersList employers={employers} />
      </Suspense>
      <EmployersModalForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        afterSubmit={afterEmployerCreated}
      />
    </>
  );
}
