import React, { useState } from "react";
import Router from "next/router";
import { useRequest } from "../../hooks/use-request";

const CreateTicket = ({ currentUser }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const [doRequest, errors] = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: (data) => Router.push("/"),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <div className={"container py-3"}>
      <form onSubmit={onSubmit}>
        <h1>{"Add Ticket"}</h1>
        <div className={"form-group"}>
          <label>{"Title"}</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={"form-control"}
          />
        </div>
        <div className={"form-group"}>
          <label>{"Price"}</label>
          <input
            type="number"
            value={price}
            onBlur={() => setPrice(parseFloat(price).toFixed(2))}
            onChange={(e) => setPrice(e.target.value)}
            className={"form-control"}
          />
        </div>
        {errors}
        <button className={"btn btn-primary"}>{"Create"}</button>
      </form>
    </div>
  );
};

export default CreateTicket;
