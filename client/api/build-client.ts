import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: "http://ticketing-app.seanjermey.uk",
      headers: req.headers,
    });
  } else {
    return axios.create();
  }
};

export { buildClient };
