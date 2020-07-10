import React, { useEffect } from "react";
import Router from "next/router";
import { useRequest } from "../../hooks/use-request";

const LogoutPage = () => {
  const [doRequest, errors] = useRequest({
    url: "/api/users/logout",
    method: "post",
    body: {},
    onSuccess: () => {
      Router.push("/");
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div className={"container py-3"}>
      <div>{"Signing you out..."}</div>
    </div>
  );
};

export default LogoutPage;
