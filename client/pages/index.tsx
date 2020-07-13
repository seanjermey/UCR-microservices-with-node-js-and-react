import React from "react";
import { Ticket } from "../types/ticket";
import Link from "next/link";

const LandingPage = ({ tickets }) => {
  return (
    <div className={"container py-3"}>
      <table className={"table table-dark table-bordered"}>
        <thead>
          <tr>
            <th scope="col" className={"w-100"}>
              Title
            </th>
            <th scope="col">Price</th>
            <th scope="col"> </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket: Ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td>{`£${ticket.price}`}</td>
              <td>
                <Link href={"/tickets/[id]"} as={`/tickets/${ticket.id}`}>
                  <a className={"btn btn-primary btn-sm"}>{"View"}</a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (ctx, client, currentUser) => {
  const { data: tickets } = await client.get("/api/tickets");

  return { tickets };
};

export default LandingPage;
