# Realtime Chat App

## Description

Is task me maine Supabase Realtime Subscriptions ka use karke ek Live Chat application banayi hai. Jab koi user naya message send karta hai to woh bina page refresh kiye foran sab users ko show ho jata hai. Is project me maine React ko Supabase ke sath connect kiya, database se messages fetch kiye aur realtime updates implement kiye.

---

## Features

- Display all chat messages
- Send new messages
- Live updates without page refresh
- Realtime database subscription
- Duplicate messages prevention

---

## Technologies Used

- React.js
- Vite
- Supabase
- Supabase Realtime
- JavaScript

---

## What I Learned

- React ko Supabase ke sath connect karna
- Supabase database me data fetch aur insert karna
- Realtime Subscriptions use karna
- `channel()` aur `postgres_changes` ki madad se live events listen karna
- React `useEffect` ke through realtime connection banana
- Component unmount hone par `removeChannel()` se cleanup karna

---

## Output

- Messages database me save hote hain.
- New message bina refresh ke sab open tabs me show ho jata hai.
- Realtime chat successfully work karti hai.

- <img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/d9c01be5-6537-4480-81ad-9872e4b4f2e0" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/4a867558-1363-40e8-b5e5-5bf100e4fc9c" />
