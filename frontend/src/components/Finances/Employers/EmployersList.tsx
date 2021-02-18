import React from "react";
import { Employer } from "client/data-contracts";

interface EmployersListProps {
  employers: Array<Employer>;
}

export default function EmployersList({
  employers,
}: EmployersListProps): JSX.Element {
  const listItems = employers.map((employer) => (
    <li key={employer.id}>{employer.name}</li>
  ));
  return (
    <>
      <ul>{listItems}</ul>
    </>
  );
}
