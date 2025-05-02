import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import Admin from './Admin';

function App() {
  const [products, setProducts] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  const placeOrder = (productId) => {
    axios.post('http://localhost:5000/order', { product_id: Number(productId) })
      .then(res => {
        alert(`Order placed! Your Order ID is ${res.data.order_id}`);
        setOrderId(res.data.order_id);
      })
      .catch(err => {
        console.error(err);
        if (err.response && err.response.status === 404) {
          alert("Product not found!");
        } else {
          alert("Failed to place order!");
        }
      });
  };

  const checkStatus = () => {
    if (!orderId) {
      alert('Please enter an Order ID');
      return;
    }

    axios.get(`http://localhost:5000/order/${orderId}`)
      .then(res => setStatus(`Status: ${res.data.status}`))
      .catch(err => {
        setStatus('Order not found');
        console.error(err);
      });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (parseFloat(price) <= 0) {
      alert('Please enter a valid price greater than zero');
      return;
    }

    const product = { name, price: parseFloat(price) };

    axios.post('http://localhost:5000/products', product)
      .then(res => {
        alert('Product added!');
        setName('');
        setPrice('');
        fetchProducts();
      })
      .catch(err => console.error(err));
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("Product deleted successfully!");
        fetchProducts();
      } else {
        alert("Product not found!");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/order/${orderId}`);
      alert('Order deleted!');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <ul className="navbar-links">
            <li><Link to="/" className="navbar-item">Home</Link></li>
            <li><Link to="/admin" className="navbar-item">Admin Panel</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={
            <div>
              <div className="welcome-banner">
                <span className="welcome-text">Welcome To</span>
              </div>
              <h1 className="bakery-title">Parth's Bakery</h1>

              <div className="grid">
                {/* Add Product Section */}
                <div className="tile">
                  <h2 className="section-title">+ Add New Product</h2>
                  <form onSubmit={handleAddProduct}>
                    <div className="input-group">
                      <span className="input-label">- Product Name</span>
                      <input
                        type="text"
                        className="input-field"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <span className="input-label">- Price</span>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="button">Add Product</button>
                  </form>
                </div>

                {/* Menu Section */}
                <div className="tile">
                  <h2 className="section-title">Menu</h2>
                  <ul className="menu-list">
                    {products.map((product) => (
                      <li key={product.id} className="menu-item">
                        <span>{product.name} ₹{product.price.toFixed(2)}</span>
                        <div className="button-group">
                          <button
                            onClick={() => placeOrder(product.id)}
                            className="button order-button"
                          >
                            Order
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="button delete-button"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Order Status Section */}
                <div className="tile">
                  <h2 className="section-title">Check Your Order Status</h2>
                  <div>
                    {status && <div className="status-item">{status}</div>}
                    <div className="input-group">
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Enter Order ID"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                      />
                    </div>
                    <button onClick={checkStatus} className="button">Check Status</button>
                  </div>
                </div>
              </div>
            </div>
          } />

          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
