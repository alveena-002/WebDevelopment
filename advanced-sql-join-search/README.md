# Advanced SQL - Orders & Customers Search

## 📌 Project Overview

This project demonstrates how to work with relational data using Supabase and React. It fetches data from **Orders** and **Customers** tables, combines the related records, and provides a search feature to filter orders by customer name or item.

## 🚀 Features

- Fetch Orders data from Supabase
- Fetch Customers data from Supabase
- Combine Orders and Customers using customer ID
- Display customer name and email with each order
- Search orders by customer name
- Search orders by item name
- Responsive and clean user interface

## 🛠️ Technologies Used

- React.js
- JavaScript
- Supabase
- CSS

## 📂 Project Structure

```
src
│── components
│   ├── SearchBar.jsx
│   └── OrderList.jsx
│
│── App.jsx
│── App.css
│── supabase.js
│── main.jsx
```

## ⚙️ Installation

1. Clone the repository

```bash
git clone <repository-url>
```

2. Navigate to the project folder

```bash
cd advanced-sql-join-search
```

3. Install dependencies

```bash
npm install
```

4. Start the development server

```bash
npm run dev
```

## 🗄️ Database

The project uses two Supabase tables:

### Customers

- id
- name
- email

### Orders

- id
- customer_name
- item
- status
- customer_id

## 🔍 Search Functionality

Users can search orders using:

- Customer Name
- Item Name

The search updates the displayed results instantly as the user types.

## 📸 Output

The application displays:

- Order Item
- Customer Name
- Customer Email
- Order Status

## 👩‍💻 Author

Developed using React and Supabase for learning Advanced SQL relationships and search functionality.