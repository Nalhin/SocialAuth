import { registerAs } from '@nestjs/config';

export default registerAs('facebook', () => ({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
}));
