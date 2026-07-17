import useCartStore from "../store/cartStore";

function ProductList() {
  const addItem = useCartStore((state) => state.addItem);

  const products = [
    { id: 1, name: "🍓 Apple" },
    { id: 2, name: "🍌 Banana" },
    { id: 3, name: "🍊 Orange" },
  ];

  return (
    <div>
      <h2>Products</h2>

      {products.map((product) => (
        <div className="product" key={product.id}>
          <p>{product.name}</p>

          <button onClick={() => addItem(product)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;