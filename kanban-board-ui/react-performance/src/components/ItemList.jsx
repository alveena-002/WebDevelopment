import Item from "./Item";

function ItemList({ items, onSelect }) {
  return (
    <div>
      {items.map((item) => (
        <Item
          key={item.id}
          item={item}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default ItemList;