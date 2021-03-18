import { AxiosError } from "axios";
import React from "react";
import { Badge } from "react-bootstrap";
import { Nullish } from "utils/base";

interface DisplayErrorProps {
  error: Nullish<AxiosError>;
}

export default function DisplayError({ error }: DisplayErrorProps): JSX.Element {
  if (!error) {
    return <></>;
  }
  const errorString = JSON.stringify(error.response?.data, null, 2);
  return (
    <>
      <span>
        <Badge variant="danger">Error {error.response?.status}</Badge>
      </span>
      <code>
        <pre>{errorString}</pre>
      </code>
    </>
  );
}
