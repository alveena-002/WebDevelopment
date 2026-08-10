function OrderList({ orders }) {
  return (
    <div className="orders">
      {orders.map((order) => (
        <div className="card" key={order.id}>
          <h3>{order.item}</h3>

          <p>
            <strong>Customer:</strong> {order.customer?.name}
          </p>

          <p>
            <strong>Email:</strong> {order.customer?.email}
          </p>

          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </div>
      ))}
    </div>
  );
}

export default OrderList;