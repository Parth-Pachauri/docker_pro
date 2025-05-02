import React, { useState } from 'react';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const product = { name, price: parseFloat(price) };

    const res = await fetch('http://localhost:5000/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    const data = await res.json();
    console.log('Product added:', data);

    setName('');
    setPrice('');
    alert('Product added!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Product</h2>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;