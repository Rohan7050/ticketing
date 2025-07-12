import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);
  if (timeLeft < 0) return <div>order expires</div>;
  return (
    <>
      <div>{timeLeft} seconds until order expires</div>
      <StripeCheckout 
        token={(token) => console.log('..........>>', token)}
        stripeKey="pk_test_51RciDNPjw29jmWIFuKYguxWJpASBA7Jyklg2c0nB0AW3pnqVFnWW7U9IVBStGqy3VwP5zNNpGs2KYmI2Z8QdEmk000wGPqCQX0"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </>
  );
};

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data.data };
};

export default OrderShow;
