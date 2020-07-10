import React, { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import { Order, User } from "../../types/ticket";
import { useRequest } from "../../hooks/use-request";
import Router from "next/router";

interface OrderPageProps {
  order: Order;
  currentUser: User;
}

const OrderPage = ({ order, currentUser }: OrderPageProps) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [doRequest, errors] = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (data) => Router.push("/orders"),
  });

  useEffect(() => {
    const updateTimeRemaining = () => {
      setTimeRemaining(
        new Date(order.expiresAt).getTime() - new Date().getTime()
      );
    };
    const timeRemainingInterval = setInterval(updateTimeRemaining, 1000);

    updateTimeRemaining();

    return () => {
      clearInterval(timeRemainingInterval);
    };
  }, []);

  const minutes = new Date(timeRemaining).getMinutes();
  const seconds = new Date(timeRemaining).getSeconds();

  return (
    <div className={"container py-3"}>
      {order && (
        <div>
          <h1>{`Purchasing ${order.ticket.title}`}</h1>
          {timeRemaining <= 0 ? (
            <div>{"Order Expired"}</div>
          ) : (
            <div>
              <p>
                {`Time left to pay:`}
                {minutes > 0 && (
                  <span className={"mx-1"}>{`${minutes} minutes`}</span>
                )}
                <span className={"mx-1"}>{`${seconds} seconds`}</span>
              </p>
              <StripeCheckout
                token={({ id }) => doRequest({ token: id })}
                stripeKey={"pk_test_sx5lRJPq8bEzbl621aDAnN1R00kSxx2Gy4"}
                amount={order.ticket.price * 100}
                email={currentUser.email}
              />
              {errors}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

OrderPage.getInitialProps = async (ctx, client) => {
  const { data } = await client.get(`/api/orders/${ctx.query.id}`);

  return { order: data as Order };
};

export default OrderPage;
