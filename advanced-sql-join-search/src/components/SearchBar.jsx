function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search by customer or item..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

export default SearchBar;