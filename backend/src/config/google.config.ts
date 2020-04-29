import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  consumerKey: process.env.GOOGLE_KEY,
  consumerSecret: process.env.GOOGLE_SECRET,
  scope: ['profile', 'email'],
}));
