import "components/Login/Login.scss";

import { Token } from "client/data-contracts";
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikProps } from "formik";
import React from "react";
import api from "utils/api";
import { object, string } from "yup";

interface Values {
  username: string;
  password: string;
}

const validationSchema = object({
  username: string().required("Username is required."),
  password: string().required("Enter your password."),
});

interface LoginProps {
  setToken(userToken: Token): void;
}

export default function Login({ setToken }: LoginProps): JSX.Element {
  const handleSubmit = async (values: Values, actions: FormikHelpers<Values>) => {
    try {
      const response = await api.auth.authenticate({ username: values.username, password: values.password });
      setToken(response.data);
      actions.setSubmitting(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        actions.setStatus("Incorrect login or password.");
        actions.setSubmitting(false);
      } else {
        throw error;
      }
    }
  };

  return (
    <>
      <main role="main" className="container">
        <div className="row justify-content-md-center">
          <div className="col-md-5 text-center">
            <div>
              <h2 className="h3 mb-3 font-weight-normal" data-cy="login-header">
                Sign in
              </h2>

              <Formik
                validationSchema={validationSchema}
                initialValues={{
                  username: "",
                  password: "",
                }}
                onSubmit={(values: Values, actions: FormikHelpers<Values>) => {
                  handleSubmit(values, actions);
                }}
              >
                {(props: FormikProps<Values>) => (
                  <Form>
                    {props.status && (
                      <div className="alert alert-danger" role="alert">
                        {props.status}
                      </div>
                    )}

                    <div className="form-group">
                      <Field name="username">
                        {({ field, meta }: FieldProps) => (
                          <>
                            <div>
                              <input
                                type="text"
                                className={`form-control ${meta.error ? "is-invalid" : ""}`}
                                placeholder="Username"
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                              />
                              {meta.touched && meta.error && (
                                <div className="invalid-feedback">{meta.error}</div>
                              )}
                            </div>
                          </>
                        )}
                      </Field>
                    </div>

                    <div className="form-group">
                      <Field name="password">
                        {({ field, meta }: FieldProps) => (
                          <>
                            <div>
                              <input
                                type="password"
                                className={`form-control ${meta.error ? "is-invalid" : ""}`}
                                placeholder="Password"
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                              />
                              {meta.touched && meta.error && (
                                <div className="invalid-feedback">{meta.error}</div>
                              )}
                            </div>
                          </>
                        )}
                      </Field>
                    </div>

                    <div className="form-group">
                      <button type="submit" className="btn btn-primary" disabled={props.isSubmitting}>
                        Sign in
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
