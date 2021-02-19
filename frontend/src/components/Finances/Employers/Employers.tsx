import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import EmployersList from "components/Finances/Employers/EmployersList";
import EmployersModalForm from "components/Finances/Employers/EmployersModalForm";
import { Employer } from "client/data-contracts";
import api from "utils/api";

export default function Employers(): JSX.Element {
  const [modalShow, setModalShow] = useState(false);
  const [employers, setEmployers] = useState([] as Array<Employer>);

  useEffect(() => {
    api.finance.getListOfEmployers({ secure: true }).then((data: any) => {
      setEmployers(data.data);
    });
  }, []);

  const afterEmployerCreated = (employer: Employer) => {
    setEmployers([employer, ...employers]);
  };

  const afterEmployerDeleted = (employerId: string) => {
    api.finance.deleteEmployer(employerId, { secure: true }).then(() => {
      setEmployers(employers.filter((item) => item.id != employerId));
    });
  };

  return (
    <>
      <h3>
        Employers
        <Button className="ml-4" size="sm" onClick={() => setModalShow(true)}>
          Create
        </Button>
      </h3>
      <EmployersList
        employers={employers}
        afterEmployerDeleted={afterEmployerDeleted}
      />
      <EmployersModalForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        afterSubmit={afterEmployerCreated}
        defaultName=""
      />
    </>
  );
}
