import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Board from "../components/Board";
import api from "../services/api";

function Home() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar />
      <Board tasks={tasks} />
    </div>
  );
}

export default Home;