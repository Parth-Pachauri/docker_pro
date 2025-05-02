import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch orders and initialize status state for each order
  const fetchOrders = () => {
    axios.get('http://localhost:5000/order')
      .then(res => {
        setOrders(res.data);
        const initialStatus = res.data.reduce((acc, order) => {
          acc[order.order_id] = order.status;
          return acc;
        }, {});        
        setOrderStatus(initialStatus);  // Set initial status state
      })
      .catch(err => console.error(err));
  };

  // Handle the status change for a specific order
  const handleStatusChange = (orderId) => {
    const newStatus = orderStatus[orderId];
    if (!newStatus) return;

    // Update the order status in the backend
    axios.put(`http://localhost:5000/order/${orderId}`, { status: newStatus })
      .then(res => {
        alert('Order status updated!');
        fetchOrders(); // Refresh orders list after status update
      })
      .catch(err => console.error(err));
  };

  // Update the status of a specific order
  const handleSelectChange = (orderId, status) => {
    setOrderStatus(prevStatus => ({
      ...prevStatus,
      [orderId]: status,  // Update the status for the specific order
    }));
  };

  // Handle order deletion
  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      axios.delete(`http://localhost:5000/order/${orderId}`)
        .then(res => {
          alert('Order deleted!');
          fetchOrders(); // Refresh orders list after deletion
        })
        .catch(err => {
          console.error(err);
          alert('Failed to delete the order');
        });
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <div className="tile">
        <h2 className="section-title">Manage Orders</h2>
        <ul className="menu-list">
        {orders.map((order) => (
  <li key={order.order_id} className="menu-item">
    <span>Order ID: {order.order_id} - Status: {order.status}</span>
    <select
      onChange={(e) => handleSelectChange(order.order_id, e.target.value)}
      value={orderStatus[order.order_id] || order.status}
    >
      <option value="pending">Pending</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
    <button
      onClick={() => handleStatusChange(order.order_id)}
      className="button order-button"
    >
      Update Status
    </button>
    <button
      onClick={() => handleDeleteOrder(order.order_id)} // Delete button
      className="button delete-button"
    >
      Delete Order
    </button>
  </li>
))}

        </ul>
      </div>
    </div>
  );
}

export default Admin;
