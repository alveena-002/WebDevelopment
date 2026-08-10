import useCartStore from "../store/cartStore";

function Cart() {
  const cart = useCartStore((state) => state.cart);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div>
      <h2>🛒 Shopping Cart</h2>

      <p className="total">Total Items: {cart.length}</p>

      {cart.length === 0 ? (
        <p className="empty">🛍️ Your cart is empty. Add some products!</p>
      ) : (
        cart.map((item, index) => (
          <div className="product" key={index}>
            <p>
              {index + 1}. {item.name}
            </p>

            <button
              className="remove-btn"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;