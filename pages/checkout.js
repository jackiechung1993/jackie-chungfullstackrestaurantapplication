import React, { useContext } from "react";
import { Row, Col } from "reactstrap";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/checkoutForm";
import AppContext from "../components/context";
import Cart from "../components/cart"; // Assuming you have a Cart component

function Checkout() {
  // get app context
  const { isAuthenticated } = useContext(AppContext);

  // load stripe to inject into elements components
  const stripePromise = loadStripe("pk_test_51PIiPh2L5fvC02CfKAj77fGZhEVAPF5673xI8BlHc9MHdbECRmJjbkZjDOBBRT9khNW6aAcSY76bXgP6RvDqgo3n00DZ07hLWP");

  return (
    <Row>
      <Col style={{ paddingRight: 0 }} sm={{ size: 3, order: 1, offset: 2 }}>
        <h1 style={{ margin: 20 }}>Checkout</h1>
        <Cart isAuthenticated={isAuthenticated} />
      </Col>
      <Col style={{ paddingLeft: 5 }} sm={{ size: 6, order: 2 }}>
        <Elements stripe={stripePromise}>
          <CheckoutForm /> 
        </Elements>
      </Col>
    </Row>
  );
}

export default Checkout;
