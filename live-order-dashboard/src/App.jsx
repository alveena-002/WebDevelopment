import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import OrderList from "./components/OrderList";
import AddOrder from "./components/AddOrder";
import "./App.css";

function App() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("id");

    setOrders(data || []);
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="container">
      <h1>Live Order Dashboard</h1>

      <AddOrder />

      <OrderList orders={orders} />
    </div>
  );
}

export default App;