import useRequest from "../../hooks/use-request";
import Router from 'next/router';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
        console.log('/////////////////////', order)
        Router.push('/orders/[orderId]', `/orders/${order.data.id}`);
    },
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <button onClick={doRequest} className="btn btn-primary">Purchase</button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;

  try {
    const ticket = await client.get(`/api/tickets/${ticketId}`);
    const data = ticket.data.data;
    console.log("data", data);
    return { ticket: data };
  } catch (error) {
    return { ticket: {} };
  }
};

export default TicketShow;
