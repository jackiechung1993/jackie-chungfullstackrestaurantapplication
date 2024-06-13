import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import AppContext from "../components/context";
import fetch from "isomorphic-fetch";
import Cookies from "js-cookie";

const OrderHistory = () => {
  const { user } = useContext(AppContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
      const token = Cookies.get("token");

      const response = await fetch(`${API_URL}/orders?user=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data);
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) return <p>Please log in to view your order history.</p>;

  return (
    <Container>
      <Row>
        <Col>
          <h1>Order History</h1>
          {orders.length > 0 ? (
            orders.map((order) => (
              <Card key={order.id} style={{ margin: "1rem 0" }}>
                <CardBody>
                  <CardTitle>Order #{order.id}</CardTitle>
                  <CardText>
                    <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
                  </CardText>
                  <CardText>
                    <strong>Total:</strong> ${order.amount}
                  </CardText>
                  <CardText>
                    <strong>Dishes:</strong> {order.dishes.map(dish => dish.name).join(", ")}
                  </CardText>
                </CardBody>
              </Card>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderHistory;
