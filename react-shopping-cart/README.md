# Shopping Cart - Zustand

## Description

Is task me maine React aur Zustand ka use karke ek simple Shopping Cart banaya hai. Is project me products ki list display ki gayi hai aur user kisi bhi product ko cart me add ya remove kar sakta hai. Shopping Cart ki state ko Zustand ke through globally manage kiya gaya hai, jis ki wajah se multiple components ek hi state ko easily access kar sakte hain.

## Features

- Display Products List
- Add Products to Cart
- Remove Products from Cart
- Global State Management using Zustand
- Total Items Counter
- Responsive and Clean UI

## Technologies Used

- React.js
- Zustand
- JavaScript
- CSS

## What I Learned

- Zustand ki madad se Global State Management karna.
- Multiple components ke darmiyan state share karna.
- `addItem()` aur `removeItem()` functions create karna.
- React components ko Zustand store ke sath connect karna.
- State update hone par UI ko automatically re-render hota dekhna.

## Project Structure

src/
- components/
  - ProductList.jsx
  - Cart.jsx
- store/
  - cartStore.js
- App.jsx
- main.jsx
- index.css

## Output

- Products ko cart me add kiya ja sakta hai.
- Added products ko remove kiya ja sakta hai.
- Header aur Cart me total items count display hota hai.