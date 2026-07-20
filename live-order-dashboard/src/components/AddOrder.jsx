import { useState } from "react";
import { supabase } from "../supabase";

function AddOrder() {
  const [customer, setCustomer] = useState("");
  const [item, setItem] = useState("");
  const [status, setStatus] = useState("");

  const addOrder = async () => {
    if (!customer || !item || !status) return;

    await supabase.from("orders").insert([
      {
        customer_name: customer,
        item,
        status,
      },
    ]);

    setCustomer("");
    setItem("");
    setStatus("");
  };

  return (
    <div>
      <input
        placeholder="Customer Name"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
      />

      <input
        placeholder="Item"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />

      <input
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />

      <button onClick={addOrder}>Add Order</button>
    </div>
  );
}

export default AddOrder;