/* eslint-disable */
import axios from "axios";

export default (on: any) => {
  // enable it for debugging
  // require("cypress-log-to-output").install(on);

  const testDataApiEndpoint = `${process.env.CYPRESS_API_ENDPOINT}/tests`;

  on("task", {
    "db:seed": async () => {
      const response = await axios.post(`${testDataApiEndpoint}/seed-db/`);
      return response.data.data;
    },
  });
};
