import { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        console.log(data);
      });
  }, []);

  return (
    <div className="container">
      <h1>Counter App</h1>

      <div className="counter">
        <button
          className="minus"
          onClick={() => setCount(count - 1)}
        >
          -
        </button>

        <h2>{count}</h2>

        <button
          className="plus"
          onClick={() => setCount(count + 1)}
        >
          +
        </button>
      </div>

      <h2>Users List</h2>

      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;