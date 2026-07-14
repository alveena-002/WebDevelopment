# React Hooks Task - useState & useEffect

## Objective

Build a React application using `useState` and `useEffect` by creating a Counter App and fetching user data from the JSONPlaceholder API.

---

## Features

- Increment and Decrement Counter
- Fetch user data from JSONPlaceholder API
- Display users in a list
- Clean and responsive user interface

---

## Technologies Used

- React
- Vite
- JavaScript
- CSS

---

## Concepts Learned

- useState Hook
- useEffect Hook
- Fetch API
- JSON Data Handling
- Rendering Lists with map()
- State Management

---

## How It Works

1. `useState` is used to manage the counter value and users data.
2. `useEffect` runs when the component loads.
3. `fetch()` requests user data from the JSONPlaceholder API.
4. `response.json()` converts the response into JavaScript objects.
5. The fetched data is stored in the `users` state.
6. `map()` is used to display all users on the screen.

---

## API Used

https://jsonplaceholder.typicode.com/users

---

## Output

- Counter with Increment (+) and Decrement (-) buttons.
- List of users fetched from the JSONPlaceholder API.

---

## What I Learned

In this task, I learned how to use React Hooks (`useState` and `useEffect`). I understood how to manage state, fetch data from an external API, and display dynamic data using the `map()` function. I also learned how React automatically re-renders the UI when the state changes.