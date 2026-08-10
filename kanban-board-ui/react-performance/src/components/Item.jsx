import React from "react";

function Item({ item, onSelect }) {
  return (
    <div className="item">
      <span>{item.name}</span>

      <button onClick={() => onSelect(item)}>
        Select
      </button>
    </div>
  );
}

export default React.memo(Item);