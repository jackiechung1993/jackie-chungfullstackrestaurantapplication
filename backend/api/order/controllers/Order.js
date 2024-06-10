"use strict";
/**
 * Order.js controller
 *
 * @description: A set of functions called "actions" for managing `Order`.
 */
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  /**
   * Create a/an order record.
   *
   * @return {Object}
   */
  create: async (ctx) => {
    try {
      // Directly access the request body since it's already a JSON object
      const { address, amount, dishes, token, city, state } = ctx.request.body;

      // Convert dollars to cents for Stripe
      const stripeAmount = Math.round(amount * 100);

      // Charge on Stripe
      const charge = await stripe.charges.create({
        amount: stripeAmount,
        currency: "usd",
        description: `Order ${new Date()} by ${ctx.state.user._id}`,
        source: token,
      });

      // Log for debugging purposes
      console.log("Processed amount (cents) for Stripe:", stripeAmount);

      // Save the amount in dollars in Strapi
      const savedAmount = amount;

      // Register the order in the database
      const order = await strapi.services.order.create({
        user: ctx.state.user.id,
        charge_id: charge.id,
        amount: savedAmount, // Save the amount in dollars
        address,
        dishes,
        city,
        state,
      });

      // Log for debugging purposes
      console.log("Saved amount (dollars) in Strapi:", savedAmount);

      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      ctx.throw(500, "Internal Server Error");
    }
  },
};
