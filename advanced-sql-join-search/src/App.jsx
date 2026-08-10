import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import SearchBar from "./components/SearchBar";
import OrderList from "./components/OrderList";
import "./App.css";

function App() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    // Fetch Orders
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*");

    // Fetch Customers
    const { data: customersData, error: customersError } = await supabase
      .from("customers")
      .select("*");

    if (ordersError || customersError) {
      console.log("Orders Error:", ordersError);
      console.log("Customers Error:", customersError);
      return;
    }

    // Merge Orders with Customers
    const mergedData = ordersData.map((order) => {
      const customer = customersData.find(
        (c) => Number(c.id) === Number(order.customer_id)
      );

      return {
        ...order,
        customer,
      };
    });

    console.log("Orders:", ordersData);
    console.log("Customers:", customersData);
    console.log("Merged:", mergedData);

    setOrders(mergedData);
  }

  // Search Filter
  const filteredOrders = orders.filter((order) => {
    const customerName = order.customer?.name?.toLowerCase() || "";
    const itemName = order.item?.toLowerCase() || "";

    return (
      customerName.includes(search.toLowerCase()) ||
      itemName.includes(search.toLowerCase())
    );
  });

  return (
    <div className="container">
      <h1>Advanced SQL - Orders & Customers</h1>

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <OrderList orders={filteredOrders} />
    </div>
  );
}

export default App;