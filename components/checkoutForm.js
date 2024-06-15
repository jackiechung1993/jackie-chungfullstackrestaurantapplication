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
      setSuccess(""); // Clear success message if there's an error
      return;
    }

    const token = tokenResponse.token;
    const userToken = Cookies.get("token");

    if (appContext.cart.total <= 0 || appContext.cart.items.length === 0) {
      setError('Your cart is empty or has an invalid total.');
      setSuccess(""); // Clear success message if there's an error
      return;
    }

    const orderData = {
      amount: appContext.cart.total, // Send amount in dollars
      dishes: appContext.cart.items,
      address: data.address,
      city: data.city,
      state: data.state,
      token: token.id,
    };

    console.log("API URL:", API_URL);
    console.log("Order Data:", orderData);
    console.log("User Token:", userToken);

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userToken && { Authorization: `Bearer ${userToken}` }),
        },
        body: JSON.stringify(orderData),
      });

      console.log("Fetch Response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error submitting order:", errorData);

        if (response.status === 401) {
          setError("You need to register and sign in to access this resource.");
        } else {
          setError(errorData.message || response.statusText);
        }
        setSuccess(""); // Clear success message if there's an error
        return;
      }

      setSuccess("Your order has been successfully processed!");
      setError(""); // Clear error message if there's success
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("An error occurred while processing your order. Please try again.");
      setSuccess(""); // Clear success message if there's an error
    }
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




