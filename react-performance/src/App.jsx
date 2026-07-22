import { useState, useMemo, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import ItemList from "./components/ItemList";
import items from "./data/items";
import "./index.css";

function App() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredItems = useMemo(() => {
    console.log("Filtering Products...");

    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleSelect = useCallback((item) => {
    setSelectedProduct(item);
  }, []);

  return (
    <div className="container">
      <h1>⚡ React Performance Optimization</h1>

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      {selectedProduct && (
        <div className="selected-box">
          <h2>Selected Product</h2>

          <p>
            <strong>ID:</strong> {selectedProduct.id}
          </p>

          <p>
            <strong>Name:</strong> {selectedProduct.name}
          </p>
        </div>
      )}

      <h3>Total Products: {filteredItems.length}</h3>

      <ItemList
        items={filteredItems}
        onSelect={handleSelect}
      />
    </div>
  );
}

export default App;