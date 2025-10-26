export const corsConfig = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3003',
    'https://checkout.stripe.com',
    'https://js.stripe.com',
    'https://api.stripe.com',
    'https://hooks.stripe.com',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: [
    'Content-Type',
    'Authorization',
  ],
};