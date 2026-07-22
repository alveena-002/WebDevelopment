# ⚡ React Performance Optimization

A React application that demonstrates performance optimization techniques by rendering and filtering a list of **1500+ products**. The project uses **useMemo**, **useCallback**, and **React.memo** to minimize unnecessary re-renders and improve performance when working with large datasets.

---

## 🚀 Features

* Display 1500+ products dynamically
* Search products in real-time
* Select a product to view its details
* Optimized filtering with **useMemo**
* Optimized callback functions with **useCallback**
* Prevent unnecessary component re-renders using **React.memo**
* Clean and responsive user interface

---

## 🛠️ Technologies Used

* React.js
* Vite
* JavaScript (ES6+)
* CSS3

---

## 📂 Project Structure

```text
react-performance/
│
├── src/
│   ├── components/
│   │   ├── Item.jsx
│   │   ├── ItemList.jsx
│   │   └── SearchBar.jsx
│   │
│   ├── data/
│   │   └── items.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Navigate to the project folder

```bash
cd react-performance
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

---

## 📖 How It Works

* The application generates a list of **1500 products**.
* Users can search products using the search bar.
* **useMemo** caches the filtered product list, so filtering only runs when the search value changes.
* **useCallback** memoizes the product selection function, preventing unnecessary function recreation.
* **React.memo** ensures each product item only re-renders when its props change.
* Clicking **Select** displays the selected product's details at the top of the page.

---

## 🎯 Performance Optimizations

### useMemo

* Prevents expensive filtering operations from running on every render.
* Recalculates the filtered list only when the search input changes.

### useCallback

* Memoizes the `handleSelect` function.
* Keeps the function reference stable across renders.

### React.memo

* Prevents unnecessary re-rendering of individual product items.
* Improves rendering performance for large lists.

---

## 📸 Output

* Displays 1500+ products.
* Real-time search functionality.
* Selected product information displayed in a highlighted section.
* Optimized rendering for better performance.

---

## 📚 Learning Outcomes

* Understanding React performance optimization techniques.
* Using **useMemo** for expensive computations.
* Using **useCallback** for stable function references.
* Using **React.memo** to reduce unnecessary component re-renders.
* Building scalable React applications with optimized rendering.

---

## 👨‍💻 Author

Developed as a React performance optimization practice project using React Hooks.
