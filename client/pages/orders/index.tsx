import React from "react";
import { Order, Ticket } from "../../types/ticket";
import Link from "next/link";

interface OrdersPageProps {
  orders: Order[];
}

const OrdersPage = ({ orders }: OrdersPageProps) => {
  return (
    <div className={"container py-3"}>
      <h1>My Orders</h1>
      <table className={"table table-dark table-bordered"}>
        <thead>
          <tr>
            <th scope="col" className={"w-100"}>
              Order
            </th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders
            .filter((order) => order.status !== "cancelled")
            .map((order) => (
              <tr
                key={order.id}
                className={order.status === "cancelled" && "text-muted"}
              >
                <td>
                  {order.status === "created" ? (
                    <Link href={"/orders/[id]"} as={`/orders/${order.id}`}>
                      <a>{order.ticket.title}</a>
                    </Link>
                  ) : (
                    order.ticket.title
                  )}
                </td>
                <td>{order.status}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

OrdersPage.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrdersPage;
