import React from "react";
import { useRequest } from "../../hooks/use-request";
import Router from "next/router";

const TicketPage = ({ ticket }) => {
  const [doRequest, errors] = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => Router.push("/orders/[id]", `/orders/${order.id}`),
  });

  return (
    <div className={"container py-3"}>
      {ticket && (
        <div>
          <h1>{ticket.title}</h1>
          <h4>{`£${ticket.price}`}</h4>
          {errors}
          <button className={"btn btn-primary"} onClick={() => doRequest()}>
            {"Purchase"}
          </button>
        </div>
      )}
    </div>
  );
};

TicketPage.getInitialProps = async (ctx, client) => {
  const { data } = await client.get(`/api/tickets/${ctx.query.id}`);

  return { ticket: data };
};

export default TicketPage;
