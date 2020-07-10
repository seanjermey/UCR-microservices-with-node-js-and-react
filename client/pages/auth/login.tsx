import React, { useState } from "react";
import Router from "next/router";

import { useRequest } from "../../hooks/use-request";

const LoginPage = ({ currentUser }) => {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("password");
  const [doRequest, errors] = useRequest({
    url: "/api/users/login",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: (data) => {
      Router.push("/");
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <div className={"container py-3"}>
      {currentUser ? (
        <div>
          {"You are already logged in. "}
          <a href={"/auth/logout"}>{"Logout"}</a>
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <h1>{"Login"}</h1>
          <div className={"form-group"}>
            <label>{"Email Address"}</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={"form-control"}
            />
          </div>
          <div className={"form-group"}>
            <label>{"Password"}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>
          {errors}
          <button className={"btn btn-primary"}>{"Login"}</button>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
