import React from "react";

interface HomeProps {}

export default function Home({}: HomeProps): JSX.Element {
  return <h2 data-test="home-page-title">Hi there!</h2>;
}
