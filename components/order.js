import axios from "axios";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("jwtToken"); // Ensure you have the JWT token stored
        const response = await axios.get(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError("You need to register and sign in to access this resource.");
        } else {
          setError("An error occurred while fetching orders.");
        }
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>{order.description}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
