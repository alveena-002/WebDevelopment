import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Board from "../components/Board";
import api from "../services/api";
import supabase from "../api/supabase";

function Home() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");

      console.log("Tasks fetched:", res.data);

      setTasks(res.data);
    } catch (error) {
      console.error("Fetch tasks error:", error);
    }
  };

  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel("tasks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        (payload) => {
          console.log("REALTIME EVENT:", payload);

          // Database change ke baad fresh data fetch
          fetchTasks();
        }
      )
      .subscribe((status) => {
        console.log("REALTIME STATUS:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <Navbar />
      <Board tasks={tasks} />
    </>
  );
}

export default Home;