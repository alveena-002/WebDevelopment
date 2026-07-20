function OrderList({ orders }) {
  return (
    <div>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <h3>{order.customer_name}</h3>

          <p>Item: {order.item}</p>

          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderList;