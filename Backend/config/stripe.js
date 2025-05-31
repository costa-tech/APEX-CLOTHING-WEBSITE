const stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripeClient;
