import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  clientID: process.env.GOOGLE_ID,
  consumerSecret: process.env.GOOGLE_SECRET,
}));
