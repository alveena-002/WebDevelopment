import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import useCartStore from "./store/cartStore";

function App() {
  const cart = useCartStore((state) => state.cart);

  return (
    <div className="container">
      <h1 className="title">
        🛒 Shopping Cart ({cart.length})
      </h1>

      <div className="card">
        <ProductList />
      </div>

      <div className="card">
        <Cart />
      </div>
    </div>
  );
}

export default App;