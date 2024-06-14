"use strict";

const stripe = require("stripe")('sk_test_51PIiPh2L5fvC02CfmmcPvypisMSU1sXLSTxsohfOf7y8Qb3y3eYqmJW15Am7wniPhYeIip58FQHLslYl3DqzqcwM007g9XFJ5g');


module.exports = {
  create: async (ctx) => {
    try {
      const { address, amount, dishes, token, city, state } = ctx.request.body;

      console.log("Received order data:", ctx.request.body);
      
      const stripeAmount = Math.round(amount * 100);
      console.log("Processed amount (cents) for Stripe:", stripeAmount);

      // Check if user is authenticated
      const user = ctx.state.user;
      if (!user || !user.id) {
        console.error("User not authenticated:", user);
        ctx.throw(400, "User not authenticated");
        return;
      }

      const charge = await stripe.charges.create({
        amount: stripeAmount,
        currency: "usd",
        description: `Order ${new Date()} by ${user.id}`,
        source: token,
      });

      console.log("Stripe charge details:", charge);

      // Save the original amount in dollars
      const savedAmount = amount;

      // Register the order
      const order = await strapi.services.order.create({
        user: user.id,
        charge_id: charge.id,
        amount: savedAmount,
        address,
        dishes,
        city,
        state,
      });

      console.log("Order saved in Strapi:", order);

      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      ctx.throw(500, "Internal Server Error");
    }
  },
};

