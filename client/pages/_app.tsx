import "bootstrap/dist/css/bootstrap.css";
import React from "react";

import { buildClient } from "../api/build-client";
import { Header } from "../components/header";

const _App = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  );
};

_App.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx);
  const { data } = await client.get("/api/users/current");

  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx, client, data.currentUser)
    : {};

  return {
    pageProps,
    ...data,
  };
};

export default _App;
