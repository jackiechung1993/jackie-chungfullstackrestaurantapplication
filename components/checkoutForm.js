import React, { useState, useContext } from "react";
import { FormGroup, Label, Input, Alert } from "reactstrap";
import fetch from "isomorphic-fetch";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CardSection from "./cardSection";
import AppContext from "./context";
import Cookies from "js-cookie";

function CheckoutForm() {
  const [data, setData] = useState({
    address: "",
    city: "",
    state: "",
    stripe_id: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State for success message
  const stripe = useStripe();
  const elements = useElements();
  const appContext = useContext(AppContext);

  function onChange(e) {
    const updateItem = { [e.target.name]: e.target.value };
    setData({ ...data, ...updateItem });
  }

  async function submitOrder() {
    const cardElement = elements.getElement(CardElement);
  
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
  
    const tokenResponse = await stripe.createToken(cardElement);
    if (tokenResponse.error) {
      setError(tokenResponse.error.message);
      return;
    }
  
    const token = tokenResponse.token;
    const userToken = Cookies.get("token");
  
    const orderData = {
      amount: Math.round(appContext.cart.total * 100) / 100, // Ensure amount is correctly rounded to two decimal places
      dishes: appContext.cart.items,
      address: data.address,
      city: data.city,
      state: data.state,
      token: token.id,
    };
  
    console.log("Sending order data:", orderData); // Add this line
  
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(userToken && { Authorization: `Bearer ${userToken}` }),
      },
      body: JSON.stringify(orderData),
    });
  
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Error submitting order:", errorMessage); // Add this line
      setError(response.statusText);
      return;
    }
  
    setSuccess("Your order has been successfully processed!");
    setError("");
    // Handle the successful order submission here
  }
  
  return (
    <div className="paper">
      <h5>Your information:</h5>
      <hr />
      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}
      <FormGroup style={{ display: "flex" }}>
        <div style={{ flex: "0.90", marginRight: 10 }}>
          <Label>Address</Label>
          <Input name="address" onChange={onChange} />
        </div>
      </FormGroup>
      <FormGroup style={{ display: "flex" }}>
        <div style={{ flex: "0.65", marginRight: "6%" }}>
          <Label>City</Label>
          <Input name="city" onChange={onChange} />
        </div>
        <div style={{ flex: "0.25", marginRight: 0 }}>
          <Label>State</Label>
          <Input name="state" onChange={onChange} />
        </div>
      </FormGroup>

      <CardSection data={data} stripeError={error} submitOrder={submitOrder} />

      <style jsx global>{`
        .paper {
          border: 1px solid lightgray;
          box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
            0px 1px 1px 0px rgba(0, 0, 0, 0.14),
            0px 2px 1px -1px rgba(0, 0, 0, 0.12);
          height: 550px;
          padding: 30px;
          background: #fff;
          border-radius: 6px;
          margin-top: 90px;
        }
      `}</style>
    </div>
  );
}

export default CheckoutForm;



