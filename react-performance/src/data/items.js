const items = Array.from({ length: 1500 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
}));

export default items;